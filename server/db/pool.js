const { Pool } = require('pg');
require('dotenv').config();

const ssl = process.env.DB_CA
    ? { require: true, rejectUnauthorized: true, ca: process.env.DB_CA.replace(/\\n/g, '\n') }
    : { require: true, rejectUnauthorized: false };

const pool = new Pool({
    connectionString: `${process.env.DB_URL}`,
    ssl,
    keepAlive: true,
    max: 20,
    idleTimeoutMillis: 30000,
});

module.exports = pool;
