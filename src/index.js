import express from "express";

import { router as userRouter } from "./routers/user.route.js";
import { router as authRouter } from "./routers/auth.route.js";
import { router as certificateRouter } from "./routers/certificate.route.js";

const port = process.env.PORT || 8080;
const baseApi = process.env.BASE_API_URL || '/';
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(`${baseApi}/user`, userRouter);
app.use(`${baseApi}/auth`, authRouter);
app.use(`${baseApi}/certificate`, certificateRouter);

app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});

export default app;
