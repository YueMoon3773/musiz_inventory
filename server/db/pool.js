// const fs = require('fs');
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: `${process.env.DB_URL}`,
    ssl: {
        rejectUnauthorized: false,
    },
    keepAlive: true,
    max: 20,
    idleTimeoutMillis: 30000,
});

module.exports = pool;
