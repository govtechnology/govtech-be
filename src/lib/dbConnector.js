import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient({
    datasources: {
        db: {
            url: process.env.JEST_DATABASE_URL ? process.env.JEST_DATABASE_URL : process.env.DATABASE_URL,
        },
    },
})
