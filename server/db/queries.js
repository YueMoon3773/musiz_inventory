const pool = require('./pool');
require('dotenv').config();

const getAllData = async () => {
    const { rows } = await pool.query(`SELECT * FROM ${process.env.DB_TABLE_NAME}`);
    return rows;
};

const getDataByCondition = async (condition) => {
    const { rows } = await pool.query(`SELECT * FROM ${process.env.DB_TABLE_NAME} WHERE id = $1`, [condition]);
    return rows;
};

module.exports = {
    getAllData,
    getDataByCondition,
};
