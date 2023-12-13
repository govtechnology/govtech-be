import { randomUUID as uuid } from "crypto";
import { sqldb } from "../lib/dbConnector";

class Session {
    static CONVENTIONAL = "CONVENTIONAL";
    static IBM_MFA = "IBM-MFA";

    constructor(userId, source) {
        this.id = uuid();
        this.userId = userId;
        this.source = source;        
    }

    async build() {
        this.connection = await sqldb.getConnection();
        return this;
    }

    async start() {
        await this.connection.beginTransaction();
        return this;
    }

    async get(page, size) {
        const limit = size;
        const offset = (page * size) - size;

        const data = await this.connection.query(
            "SELECT s.id, s.comment, s.source, TIMESTAMPDIFF(SECOND, s.createdAt, s.revokedAt) AS duration, 'SECOND' as durationType, CASE WHEN s.revokedAt IS NOT NULL THEN 'true' ELSE 'false' END AS isLoggedOut, s.revokedAt AS loggedOutAt, s.createdAt AS loggedInAt FROM sessions AS s WHERE s.userId = ? ORDER BY createdAt DESC LIMIT ? OFFSET ?",
            [this.userId, limit, offset]
        )
        
        const total = await this.connection.query(
            "SELECT COUNT(*) AS total FROM sessions AS s WHERE s.userId = ?",
            [this.userId]
        )

        this.connection.release();

        return {
            data: data[0],
            total: total[0][0].total
        };
    }

    async revoke() {
        await this.connection.execute(
            "UPDATE sessions SET revokedAt = NOW() WHERE userId = ? AND revokedAt IS NUll",
            [this.userId]
        )

        return this;
    }
    
    static async revoke(userId) {
        await sqldb.execute(
            "UPDATE sessions SET revokedAt = NOW() WHERE userId = ? AND revokedAt IS NUll",
            [userId]
        )
    }

    async persist() {
        await this.connection.execute(
            "INSERT INTO sessions (id, userId, source) VALUES (?,?,?)", 
            [this.id, this.userId, this.source]
        )

        return this;
    }

    async finish() {
        this.id = null;
        this.userId = null;
        this.source = null;

        await this.connection.commit();
        this.connection.release();
    }
}

export default Session;
