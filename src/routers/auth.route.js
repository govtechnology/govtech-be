import { Router } from "express";
import { authController } from "../controller/auth.controller";
import { tokenValidation } from "../lib/tokenHandler";

export const router = Router();

router.post("/signin", authController.signIn);
router.post("/signup", authController.signUp);
router.post("/otp/generate", tokenValidation(), authController.GenerateOTP);
router.post("/otp/verify", tokenValidation(), authController.VerifyOTP);
router.post("/otp/validate", tokenValidation(), authController.ValidateOTP);
router.post("/otp/disable", tokenValidation(), authController.DisableOTP);
