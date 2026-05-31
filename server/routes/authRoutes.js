import express from "express";
const router = express.Router();

import { registerUser } from "../controllers/registerController.js";
import { loginUser } from "../controllers/loginController.js";

router.post("/register", registerUser);
router.post("/login", loginUser);

export default router;