const mysql = require("mysql2/promise");

export const sqldb = mysql.createPool({
  uri: process.env.DATABASE_URL,
  waitForConnections: true,
});
