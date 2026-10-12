const { OracleDBRunner } = require('@cubejs-backend/testing-shared');
const { OracleDriver } = require('../driver/OracleDriver');

describe('OracleDriver', () => {
  let container;
  let driver;

  jest.setTimeout(5 * 60 * 1000);

  beforeAll(async () => {
    container = await OracleDBRunner.startContainer({});
    driver = new OracleDriver({
      host: container.getHost(),
      port: container.getMappedPort(1521),
      user: 'system',
      password: 'test',
      db: 'FREEPDB1',
    });
  });

  afterAll(async () => {
    await driver?.release();
    await container?.stop();
  });

  test('returns all rows of a query without capping them', async () => {
    // Row limits are applied by Cube in the generated SQL, the driver must not truncate silently
    const rows = await driver.query('SELECT LEVEL AS n FROM DUAL CONNECT BY LEVEL <= 100001', []);
    expect(rows).toHaveLength(100001);
  });

  test('streams query results with column types for streamImport', async () => {
    const data = await driver.downloadQueryResults(
      'SELECT LEVEL AS n FROM DUAL WHERE LEVEL > :"?" CONNECT BY LEVEL <= 3',
      [0],
      { streamImport: true, highWaterMark: 100 }
    );

    const rows = await data.rowStream.toArray();
    await data.release();

    expect(data.types).toEqual([{ name: 'N', type: 'decimal' }]);
    expect(rows).toEqual([{ N: 1 }, { N: 2 }, { N: 3 }]);
  });

  test('release closes a stream that was not read to the end', async () => {
    const { rowStream, release } = await driver.stream(
      'SELECT LEVEL AS n FROM DUAL CONNECT BY LEVEL <= 100001',
      [],
      { highWaterMark: 100 }
    );

    // A client that disconnects early only calls release, the connection must not stay borrowed
    await release();

    expect(rowStream.destroyed).toBe(true);
    expect(driver.pool.borrowed).toBe(0);
  });

  test('stream releases the connection when the query fails', async () => {
    await expect(driver.stream('SELECT no_such_column FROM DUAL', [], {})).rejects.toThrow('ORA-00904');

    expect(driver.pool.borrowed).toBe(0);
  });
});
