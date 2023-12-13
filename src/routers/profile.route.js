import { Router } from "express";
import { tokenValidation } from "../lib/tokenHandler";
import { profileController } from "../controller/profile.controller";
import { multerHelper } from "../lib/fileUploader";

export const router = Router();

router.get("/", tokenValidation(), profileController.getUserProfile);
router.patch(
  "/",
  tokenValidation(),
  multerHelper.single("file"),
  profileController.updateUserProfile
);
