const { readFileSync } = require('node:fs');
const pool = require('./lib/utils/pool');
const sql = readFileSync('./sql/setup.sql', 'utf-8');

async function setupDb() {
  try {
    const response = await pool.query(sql);
    console.log(response);
  } catch (e) {
    console.log(e);
  }
}


setupDb();
