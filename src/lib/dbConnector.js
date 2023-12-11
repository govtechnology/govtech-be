import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient({
  log: ["query"],
  datasources: {
    db: {
      url: process.env.JEST_DATABASE_URL
        ? process.env.JEST_DATABASE_URL
        : process.env.DATABASE_URL,
    },
  },
});

const mysql = require("mysql2/promise");

// export const sqldb = mysql.createConnection({
//   host: "46.250.227.1",
//   pool: "31120",
//   user: "root",
//   password: "gxDdlk7wRxqgzy70HZncYbvRFcVUXINM",
//   database: "govtech-ngubalan",
// });

export const sqldb = mysql.createPool({
  host: "46.250.227.1",
  pool: "31120",
  user: "root",
  password: "gxDdlk7wRxqgzy70HZncYbvRFcVUXINM",
  database: "govtech-ngubalan",
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 10,
  idleTimeout: 60000,
  queueLimit: 0,
});
