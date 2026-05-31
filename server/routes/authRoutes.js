import express from "express";
import router from express.Router();

import { registerUser } from "../controllers/registerController.js";
import { loginUser } from "../controllers/loginController.js";

router.post("/register", registerUser);
router.post("/login", loginUser);

export default router;