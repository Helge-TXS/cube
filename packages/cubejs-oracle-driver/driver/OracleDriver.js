/**
 * @copyright Cube Dev, Inc.
 * @license Apache-2.0
 * @fileoverview The `OracleDriver` and related types declaration.
 */

const {
  getEnv,
  assertDataSource,
} = require('@cubejs-backend/shared');
const { BaseDriver, TableColumn } = require('@cubejs-backend/base-driver');
const oracledb = require('oracledb');
const { reduce } = require('ramda');

let thickModeInitialized = false;

const sortByKeys = (unordered) => {
  const ordered = {};

  Object.keys(unordered).sort().forEach((key) => {
    ordered[key] = unordered[key];
  });

  return ordered;
};

const reduceCb = (result, i) => {
  let schema = (result[i.table_schema] || {});
  let tables = (schema[i.table_name] || []);
  let attributes = new Array();

  if (i.key_type === "P" || i.key_type === "U") {
    attributes.push(["primaryKey"]);
  }

  tables.push({
    name: i.column_name,
    type: i.data_type,
    attributes
  });

  schema[i.table_name] = tables.sort();
  result[i.table_schema] = sortByKeys(schema);

  return sortByKeys(result);
};

/**
 * Initialize Oracle thick mode if enabled.
 * Must be called once before any pool creation.
 * @param {string} dataSource - The data source name
 */
function initThickMode(dataSource) {
  if (thickModeInitialized) {
    return;
  }

  const thickMode = getEnv('dbOracleThickMode', { dataSource });
  if (!thickMode) {
    return;
  }

  const libDir = getEnv('dbOracleLibDir', { dataSource });
  const configDir = getEnv('dbOracleConfigDir', { dataSource });

  const options = {};
  if (libDir) {
    options.libDir = libDir;
  }
  if (configDir) {
    options.configDir = configDir;
  }

  try {
    oracledb.initOracleClient(options);
    thickModeInitialized = true;
    console.log(
      `[OracleDriver] Initialized in thick mode${libDir ? ` (libDir: ${libDir})` : ''}${configDir ? ` (configDir: ${configDir})` : ''}`
    );
  } catch (error) {
    if (error.message && error.message.includes('DPI-1047')) {
      const libDirHint = libDir
        ? `CUBEJS_DB_ORACLE_LIB_DIR is set to "${libDir}" but Oracle Client libraries were not found there.`
        : 'Set CUBEJS_DB_ORACLE_LIB_DIR to the path of your Oracle Instant Client libraries.';

      throw new Error(
        `Oracle thick mode is enabled but Oracle Client libraries could not be loaded. ` +
        `${libDirHint} ` +
        `See https://node-oracledb.readthedocs.io/en/latest/user_guide/installation.html for installation instructions. ` +
        `Original error: ${error.message}`
      );
    }
    throw error;
  }
}

/**
 * Oracle driver class.
 */
class OracleDriver extends BaseDriver {
  /**
   * Returns default concurrency value.
   */
  static getDefaultConcurrency() {
    return 2;
  }

  /**
   * Returns the configurable driver options.
   * Note: It returns the unprefixed option names.
   * In case of using multi-sources options need to be prefixed manually.
   */
  static driverEnvVariables() {
    return [
      'CUBEJS_DB_NAME',
      'CUBEJS_DB_USER',
      'CUBEJS_DB_PASS',
      'CUBEJS_DB_HOST',
      'CUBEJS_DB_PORT',
      'CUBEJS_DB_ORACLE_THICK_MODE',
      'CUBEJS_DB_ORACLE_LIB_DIR',
      'CUBEJS_DB_ORACLE_CONFIG_DIR',
    ];
  }

  /**
   * Class constructor.
   */
  constructor(config = {}) {
    super({
      testConnectionTimeout: config.testConnectionTimeout,
    });

    const dataSource =
      config.dataSource ||
      assertDataSource('default');

    // Initialize thick mode before any pool creation
    initThickMode(dataSource);

    this.db = oracledb;
    this.db.outFormat = this.db.OBJECT;
    this.db.partRows = 100000;
    this.db.maxRows = 100000;
    this.db.prefetchRows = 500;
    
    // Convert the fetched timestamp data to reflect
    // the locale time settings of the client
    this.db.fetchTypeHandler = function(metadata) {
      if (metadata.dbType === oracledb.DB_TYPE_DATE ||
        metadata.dbType === oracledb.DB_TYPE_TIMESTAMP ||
        metadata.dbType === oracledb.DB_TYPE_TIMESTAMP_LTZ ||
        metadata.dbType === oracledb.DB_TYPE_TIMESTAMP_TZ)
        return {converter: (v) => v.toLocaleString() };
    };

    this.config = {
      user: getEnv('dbUser', { dataSource }),
      password: getEnv('dbPass', { dataSource }),
      db: getEnv('dbName', { dataSource }),
      host: getEnv('dbHost', { dataSource }),
      port: getEnv('dbPort', { dataSource }) || 1521,
      poolMin: 0,
      poolMax:
        config.maxPoolSize ||
        getEnv('dbMaxPoolSize', { dataSource }) ||
        50,
      ...config
    };
    this.config.connectionString = this.config.connectionString || `${this.config.host}:${this.config.port}/${this.config.db}`;
  }

  async tablesSchema() {
    const data = await this.query(`
      select tc.owner         "table_schema"
          , tc.table_name     "table_name"
          , tc.column_name    "column_name"
          , tc.data_type      "data_type"
          , c.constraint_type "key_type"
      from all_tab_columns tc
      left join all_cons_columns cc
        on (tc.owner, tc.table_name, tc.column_name)
        in ((cc.owner, cc.table_name, cc.column_name))
      left join all_constraints c
        on (tc.owner, tc.table_name, cc.constraint_name)
        in ((c.owner, c.table_name, c.constraint_name))
        and c.constraint_type
        in ('P','U')
      where tc.owner = user
    `);

    return reduce(reduceCb, {}, data);
  }

  async getConnectionFromPool() {
    if (!this.pool) {
      this.pool = await this.db.createPool(this.config);
    }

    return this.pool.getConnection()
  }

  async testConnection() {
    await this.query('SELECT 1 FROM DUAL', {});
  }

  async createTable(quotedTableName, columns) {
    if (quotedTableName.length > 128) {
      throw new Error('Oracle can not work with table names longer than 128 symbols. ' +
        `Consider using the 'sqlAlias' attribute in your cube definition for ${quotedTableName}.`);
    }
    return super.createTable(quotedTableName, columns);
  }

  async query(query, values) {
    const conn = await this.getConnectionFromPool();

    try {
      const res = await conn.execute(query, values || {});
      return res && res.rows;
    } catch (e) {
      throw (e);
    } finally {
      try {
        await conn.close();
      } catch (e) {
        throw e;
      }
    }
  }

  /**
   * Execute a query and return both rows and column type metadata.
   * Unlike the base class implementation, this uses Oracle's metaData
   * to determine column types, which works even with empty result sets.
   */
  async downloadQueryResults(query, values, options) {
    const conn = await this.getConnectionFromPool();

    try {
      const res = await conn.execute(query, values || {});
      const rows = res && res.rows || [];
      const types = (res && res.metaData || []).map((col) => ({
        name: col.name,
        type: this.oracleDbTypeToGeneric(col.dbType),
      }));
      return { rows, types };
    } finally {
      try {
        await conn.close();
      } catch (e) {
        throw e;
      }
    }
  }

  /**
   * Map Oracle DB_TYPE constants to generic Cube types.
   */
  oracleDbTypeToGeneric(dbType) {
    switch (dbType) {
      case oracledb.DB_TYPE_NUMBER:
      case oracledb.DB_TYPE_BINARY_FLOAT:
      case oracledb.DB_TYPE_BINARY_DOUBLE:
      case oracledb.DB_TYPE_BINARY_INTEGER:
        return 'decimal';
      case oracledb.DB_TYPE_DATE:
        return 'timestamp';
      case oracledb.DB_TYPE_TIMESTAMP:
      case oracledb.DB_TYPE_TIMESTAMP_LTZ:
      case oracledb.DB_TYPE_TIMESTAMP_TZ:
        return 'timestamp';
      case oracledb.DB_TYPE_CHAR:
      case oracledb.DB_TYPE_VARCHAR:
      case oracledb.DB_TYPE_NCHAR:
      case oracledb.DB_TYPE_NVARCHAR:
        return 'text';
      case oracledb.DB_TYPE_CLOB:
      case oracledb.DB_TYPE_NCLOB:
      case oracledb.DB_TYPE_LONG:
        return 'text';
      default:
        return 'text';
    }
  }

  release() {
    return this.pool && this.pool.close();
  }

  readOnly() {
    return true;
  }

  wrapQueryWithLimit(query) {
    query.query = `SELECT * FROM (${query.query}) AS t WHERE ROWNUM <= ${query.limit}`;
  }
}

module.exports = OracleDriver;
