import { Router } from "express";
import { authController } from "../controller/auth.controller";

export const router = Router();

router.post("/signin", authController.signIn);
router.post("/signup", authController.signUp);