const pool = require('../lib/utils/pool');
const { readFileSync } = require('node:fs');
const sql = readFileSync('./sql/setup.sql', 'utf-8');

async function setupDb() {
  return await pool.query(sql);
}

setupDb();
