import { Router } from "express";
import { userController } from "../controller/user.controller";
import { tokenValidation } from "../lib/tokenHandler";

export const router = Router();

router.get("/", tokenValidation(), userController.getUser);