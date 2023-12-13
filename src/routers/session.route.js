import { Router } from "express";
import { tokenValidation } from "../lib/tokenHandler";
import { sessionController } from "../controller/session.controller";

export const router = Router();

router.get("/", tokenValidation(), sessionController.get);
