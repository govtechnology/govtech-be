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

export const sqldb = mysql.createPool({
  uri: process.env.DATABASE_URL,
  waitForConnections: true,
});

// export const sqldb = mysql.createPool({
//   uri: process.env.DATABASE_URL,
//   waitForConnections: true,
// });
