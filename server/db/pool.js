const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: `postgresql://${process.env.DB_USER_NAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`,
    // connectionString: `${process.env.DB_URL}`,
    ssl: {
        require: true,
        rejectUnauthorized: false,
    },
    keepAlive: true,
    max: 20,
    idleTimeoutMillis: 30000,
});

module.exports = pool;
