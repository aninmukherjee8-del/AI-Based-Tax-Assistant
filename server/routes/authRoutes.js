import express from "express";
import { googleLogin } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
const router = express.Router();

import { registerUser } from "../controllers/registerController.js";
import { loginUser } from "../controllers/loginController.js";

router.post("/google", googleLogin);

export default router;