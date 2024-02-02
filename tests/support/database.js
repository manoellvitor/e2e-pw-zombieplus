const { Pool } = require("pg");
require("dotenv").config();

const DbConfig = {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
};

export async function executeSQL(sqlScript) {
  try {
    const pool = new Pool(DbConfig);
    const client = await pool.connect();
    const result = await client.query(sqlScript);
    console.log(result);
  } catch (error) {
    console.log(`Error: ${error}`);
  }
}
