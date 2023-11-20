import express from "express";
import cors from "cors";

import { router as userRouter } from "./routers/user.route.js";
import { router as profileRouter } from "./routers/profile.route.js";
import { router as authRouter } from "./routers/auth.route.js";
import { router as certificateRouter } from "./routers/certificate.route.js";

const port = process.env.PORT || 8080;
const baseApi = process.env.BASE_API_URL || "/";
const app = express();
const corsOptions = {
  origin: "*",
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
    "Origin",
  ],
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));

app.use(`${baseApi}/user`, userRouter);
app.use(`${baseApi}/profile`, profileRouter);
app.use(`${baseApi}/auth`, authRouter);
app.use(`${baseApi}/certificate`, certificateRouter);

app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});

export default app;
