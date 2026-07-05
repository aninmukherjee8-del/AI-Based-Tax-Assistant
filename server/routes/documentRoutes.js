import express from "express";
import multer from "multer";
import { parseDocument,getUserDocuments} from "../controllers/documentController.js";
import { protect } from "../middleware/authMiddleware.js";

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
    protect,
    upload.single("document"),
    parseDocument
);
router.get(
    "/",
    protect,
    getUserDocuments
);

export default router;