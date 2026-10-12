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
});
