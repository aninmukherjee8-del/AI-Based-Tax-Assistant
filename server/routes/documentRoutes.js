import express from "express";
import multer from "multer";
import { parseDocument } from "../controllers/documentController.js";

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },

    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const upload = multer({ storage });

router.post(
    "/parse",
    upload.single("document"),
    parseDocument
);

export default router;