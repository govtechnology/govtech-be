import { Router } from "express";
import { tokenValidation } from "../lib/tokenHandler";
import { profileController } from "../controller/profile.controller";

export const router = Router();

router.get("/", tokenValidation(), profileController.getUserProfile);
