import express from "express";
import { verifyMSG91Token } from "../controllers/otpController.js";

const router = express.Router();

router.post("/verify-msg91-token", verifyMSG91Token);

export default router;