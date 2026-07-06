import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
    getTaxProfile,
    updateTaxProfile
} from "../controllers/taxProfileController.js";

const router = express.Router();

router.get("/", protect, getTaxProfile);

router.put("/", protect, updateTaxProfile);

export default router;