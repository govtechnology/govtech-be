const mysql = require("mysql2/promise");

export const sqldb = mysql.createPool({
  host: '192.168.112.1',
  port: 3306,
  user: 'ngubalan',
  password: 'ngubalan123',
  database: 'test',
  waitForConnections: false
});
