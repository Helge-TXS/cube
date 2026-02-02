/**
 * @copyright Cube Dev, Inc.
 * @license Apache-2.0
 * @fileoverview The `OracleDriver` and related types declaration.
 */

const {
  getEnv,
  assertDataSource,
  Pool,
} = require('@cubejs-backend/shared');
const { BaseDriver, TableColumn, createPoolName } = require('@cubejs-backend/base-driver');
const oracledb = require('oracledb');
const { reduce } = require('ramda');
const moment = require('moment');

// Maps Oracle `metaData.dbTypeName` strings to Cube generic types. NUMBER and the
// TIMESTAMP* family are handled separately (scale-based / prefix match) below.
const OracleTypeToGenericType = {
  varchar2: 'text',
  nvarchar2: 'text',
  char: 'text',
  nchar: 'text',
  clob: 'text',
  nclob: 'text',
  long: 'text',
  binary_float: 'float',
  binary_double: 'double',
  date: 'timestamp',
  'number': 'decimal',
};

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

const timestampTypeParser = (val) => moment(val).format(moment.HTML5_FMT.DATETIME_LOCAL_MS);

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
    const preAggregations = config.preAggregations || false;

    // Initialize thick mode before any pool creation
    initThickMode(dataSource);

    this.db = oracledb;
    this.db.outFormat = this.db.OBJECT;
    this.db.partRows = 100000;
    this.db.maxRows = 100000;
    this.db.prefetchRows = 500;

    // oracledb hands DATE/TIMESTAMP columns back as JS Date objects in the driver's
    // local timezone; Cube expects a naive ISO-like string.
    this.db.fetchTypeHandler = function (metadata) {
      if (metadata.dbType === oracledb.DB_TYPE_DATE ||
        metadata.dbType === oracledb.DB_TYPE_TIMESTAMP ||
        metadata.dbType === oracledb.DB_TYPE_TIMESTAMP_LTZ ||
        metadata.dbType === oracledb.DB_TYPE_TIMESTAMP_TZ) {
        return { converter: timestampTypeParser };
      }
      return undefined;
    };

    const { maxPoolSize, pool, ...connectionConfig } = config;

    this.config = {
      user: getEnv('dbUser', { dataSource, preAggregations }),
      password: getEnv('dbPass', { dataSource, preAggregations }),
      db: getEnv('dbName', { dataSource, preAggregations }),
      host: getEnv('dbHost', { dataSource, preAggregations }),
      port: getEnv('dbPort', { dataSource, preAggregations }) || 1521,
      ...connectionConfig,
    };
    this.config.connectionString = this.config.connectionString || `${this.config.host}:${this.config.port}/${this.config.db}`;

    const poolName = createPoolName('oracle', dataSource, preAggregations);
    this.pool = new Pool(poolName, {
      create: async () => {
        const connection = await this.db.getConnection(this.config);
        await OracleDriver.initConnection(connection);

        return connection;
      },
      validate: async (connection) => {
        try {
          await connection.ping();
        } catch (e) {
          this.databasePoolError(e);
          return false;
        }

        return true;
      },
      destroy: (connection) => connection.close(),
    }, {
      min: 0,
      max:
        maxPoolSize ||
        getEnv('dbMaxPoolSize', { dataSource, preAggregations }) ||
        50,
      evictionRunIntervalMillis: 10000,
      softIdleTimeoutMillis: 30000,
      idleTimeoutMillis: 30000,
      testOnBorrow: true,
      acquireTimeoutMillis: 20000,
      ...pool,
    });
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

  /**
   * Runs once per pooled session. Aligns the session NLS formats with the ISO-ish
   * date strings Cube binds, so implicit string→DATE/TIMESTAMP conversions (e.g.
   * the native planner's `CAST(? AS TIMESTAMP)` over a 'YYYY-MM-DD' filter bound)
   * parse instead of failing with ORA-01843 under Oracle's default NLS. Explicit
   * TO_DATE/TO_TIMESTAMP calls carry their own masks and are unaffected.
   * @protected
   */
  static async initConnection(connection) {
    await connection.execute(
      "ALTER SESSION SET NLS_DATE_FORMAT = 'YYYY-MM-DD' NLS_TIMESTAMP_FORMAT = 'YYYY-MM-DD' NLS_TIMESTAMP_TZ_FORMAT = 'YYYY-MM-DD HH24:MI:SS.FF TZH:TZM'"
    );
  }

  /**
   * Acquires a connection from the pool, runs `fn`, and always releases the
   * connection back to the pool (on both success and failure).
   * @protected
   */
  async withConnection(fn) {
    const connection = await this.pool.acquire();

    try {
      return await fn(connection);
    } finally {
      await this.pool.release(connection);
    }
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

  static normalizeParams(query, values) {
    if (!values || values.length === 0) {
      return { sql: query, binds: {} };
    }

    const binds = {};
    const valueToName = new Map();
    let idx = 0;
    let nextName = 0;

    // `:"?"` must be matched as a whole before a lone `?`, so it appears first
    // in the alternation; since it starts with `:`, its inner `?` is consumed
    // as part of the match and never matched again on its own.
    //
    // Placeholders carrying the same value share a single named bind. This is
    // semantically identical (the same value is bound) and keeps repeated
    // expressions textually identical across clauses — required by Oracle, which
    // otherwise rejects e.g. a CASE expression in both SELECT and GROUP BY when
    // its param renders as two different bind names (ORA-00979).
    const sql = query.replace(/:"\?"|\?/g, () => {
      const value = values[idx];
      idx += 1;
      // A Map distinguishes values by SameValueZero, so 1 and '1' stay separate;
      // the raw value works as the key without stringifying.
      let name = valueToName.get(value);
      if (name === undefined) {
        name = `cb_param_${nextName}`;
        nextName += 1;
        valueToName.set(value, name);
        binds[name] = value;
      }
      return `:${name}`;
    });

    return { sql, binds };
  }

  async query(query, values) {
    return this.withConnection(async (conn) => {
      const { sql, binds } = OracleDriver.normalizeParams(query, values);
      const res = await conn.execute(sql, binds);
      return res && res.rows;
    });
  }

  static metaDataToColumnTypes(metaData) {
    return (metaData || []).map((column) => {
      const dbTypeName = (column.dbTypeName || '').toLowerCase();
      let type = 'text';

      if (dbTypeName.startsWith('timestamp')) {
        type = 'timestamp';
      } else {
        type = OracleTypeToGenericType[dbTypeName] || 'text';
      }

      return { name: column.name, type };
    });
  }

  async downloadQueryResults(query, values, _options) {
    return this.withConnection(async (conn) => {
      const { sql, binds } = OracleDriver.normalizeParams(query, values);
      const res = await conn.execute(sql, binds);
      return {
        rows: (res && res.rows) || [],
        types: OracleDriver.metaDataToColumnTypes(res && res.metaData),
      };
    });
  }

  async release() {
    await this.pool.drain();
    await this.pool.clear();
  }

  readOnly() {
    return true;
  }

  wrapQueryWithLimit(query) {
    // Oracle forbids the `AS` keyword for table/subquery aliases.
    query.query = `SELECT * FROM (${query.query}) t WHERE ROWNUM <= ${query.limit}`;
  }
}

module.exports = OracleDriver;
