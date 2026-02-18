import * as http from 'http';
import { clearInterval } from 'timers';
import { CubejsServerCoreExposed } from '../types/CubejsServerCoreExposed';

export async function postRequest(
  port: number,
  path: string,
  tkn: string,
  data: unknown,
): Promise<http.IncomingMessage> {
  return new Promise(
    (resolve: (res: http.IncomingMessage) => void, reject) => {
      const options = {
        hostname: 'localhost',
        port,
        path,
        method: 'POST',
        headers: {
          authorization: tkn,
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(JSON.stringify(data)),
        },
      };
      const req = http.request(options, (res) => {
        resolve(res);
      });
      req.on('error', (e) => {
        reject(`Problem with request: ${e.message}.`);
      });
      req.write(JSON.stringify(data));
      req.end();
    },
  );
}

export async function readData(
  res: http.IncomingMessage,
): Promise<Buffer> {
  return new Promise((resolve) => {
    let buffer = Buffer.from([]);
    res.on('data', (chunk: Buffer) => {
      buffer = Buffer.concat([buffer, Buffer.from(chunk)]);
    });
    res.on('end', () => {
      resolve(buffer);
    });
  });
}

async function postRequestWithRetry(
  port: number,
  path: string,
  token: string,
  data: unknown,
  retries: number = 10,
  delayMs: number = 3000,
): Promise<http.IncomingMessage> {
  for (let i = 0; i < retries; i++) {
    try {
      return await postRequest(port, path, token, data);
    } catch (e) {
      if (i < retries - 1) {
        console.log(`[buildPreaggs] Request failed (attempt ${i + 1}/${retries}), retrying in ${delayMs}ms: ${e}`);
        await new Promise((r) => setTimeout(r, delayMs));
      } else {
        throw e;
      }
    }
  }
  throw new Error('Unreachable');
}

export async function buildPreaggs(
  port: number,
  token: string,
  selector: any,
) {
  const post = await postRequestWithRetry(
    port,
    '/cubejs-api/v1/pre-aggregations/jobs',
    token,
    { action: 'post', selector },
  );
  const _jobs = await readData(post);
  const jobs = <string[]>JSON.parse(_jobs.toString());
  if (jobs.length === 0) {
    return true;
  }

  return new Promise((resolve, reject) => {
    const interval = setInterval(async () => {
      try {
        const inProcess: string[] = [];
        const get = await postRequest(
          port,
          '/cubejs-api/v1/pre-aggregations/jobs',
          token,
          { action: 'get', resType: 'object', tokens: jobs },
        );
        const statuses = JSON.parse((await readData(get)).toString());
        Object.keys(statuses).forEach((t: string) => {
          const info = statuses[t];
          const status = info && info.status;
          if (!status) {
            return;
          }
          if (status.indexOf('failure') >= 0) {
            clearInterval(interval);
            reject(`Cube pre-aggregations build failed: ${status}`);
          }
          if (status !== 'done' && status !== 'missing_partition') {
            inProcess.push(t);
          }
        });
        if (inProcess.length === 0) {
          clearInterval(interval);
          resolve(true);
        }
      } catch (e) {
        console.log(`[buildPreaggs] Polling error: ${e}`);
      }
    }, 1000);

    setTimeout(() => {
      clearInterval(interval);
      reject('Cube pre-aggregations build failed: timeout.');
    }, 120000);
  });
}

export async function hookPreaggs(
  core: CubejsServerCoreExposed,
  preagg: string,
) {
  const tokens: string[] = await core
    .getRefreshScheduler()
    .postBuildJobs(
      {
        authInfo: { tenantId: 'tenant1' },
        securityContext: { tenantId: 'tenant1' },
        requestId: 'XXX',
      },
      {
        timezones: ['UTC'],
        preAggregations: [{ id: preagg }],
        throwErrors: false,
      }
    );

  return new Promise((resolve, reject) => {
    const interval = setInterval(async () => {
      const inProcess = [];
      const selectors: {
        token: string,
        table: string,
        status: string,
        selector: any,
      }[] = await core
        .apiGateway()
        .preAggregationsJobsGET(
          {
            authInfo: { tenantId: 'tenant1' },
            securityContext: { tenantId: 'tenant1' },
            requestId: 'XXX',
          },
          tokens,
        );
  
      selectors.forEach((info) => {
        const { status } = info;
        if (status.indexOf('failure') >= 0) {
          reject(`Cube pre-aggregations build failed: ${status}`);
        }
        if (status !== 'done' && status !== 'missing_partition') {
          inProcess.push(info);
        }
        if (inProcess.length === 0) {
          clearInterval(interval);
          resolve(true);
        }
      });
    }, 1000);

    setTimeout(() => {
      clearInterval(interval);
      reject('Cube pre-aggregations build failed: timeout.');
    }, 60000);
  });
}
