import { Router } from "express";
import { certificateController } from "../controller/certificate.controller";
import { tokenValidation } from "../lib/tokenHandler";

export const router = Router();

router.get("/", tokenValidation(), certificateController.getCertificate);
router.get("/:id", tokenValidation(), certificateController.getCertificateById);
router.post("/download", certificateController.getCertificateLink);
router.post("/generate", certificateController.generateCertificate);
router.post(
  "/request",
  tokenValidation(),
  certificateController.requestCertificate
);
