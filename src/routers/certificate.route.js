import { Router } from "express";
import { certificateController } from "../controller/certificate.controller";
import { tokenValidation } from "../lib/tokenHandler";

export const router = Router();

router.get("/", tokenValidation(), certificateController.getCertificate);
router.post("/request", tokenValidation(), certificateController.requestCertificate);