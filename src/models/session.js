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
