import express from "express"
import dotenv from "dotenv";

dotenv.config({ path: "../../.env.test" });

import { router as certificateRouter } from "../routers/certificate.route";

const server = () => {
    const app = express()

    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))

    app.use(`/certificate`, certificateRouter);

    return app
}

export default server
