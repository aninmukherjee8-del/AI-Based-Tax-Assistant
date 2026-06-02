import { extractText } from "../services/ocrService.js";
import { uploadDocument } from "../services/cloudinaryService.js";
import Document from "../models/Document.js";
import { generateFileHash } from "../utils/hashFile.js";
import fs from "fs";

export const parseDocument = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No file uploaded"
            });
        }
        const filePath = req.file.path;
        const fileHash = generateFileHash(filePath);

        // Existing PDF text extraction
        const rawText = await extractText(filePath);

        // Temporary userId for testing
        // Replace with req.user.id once auth is added
        const userId = "test-user";
        const existingDocument =
            await Document.findOne({
                userId,
                fileHash
            });

        if (existingDocument) {
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
            return res.status(200).json({
                success: true,
                alreadyUploaded: true,
                document: existingDocument
            });
        }
        const cloudinaryResult = await uploadDocument(
            filePath,
            userId
        );

        const document =
        await Document.create({
            userId,
            originalFileName:
                req.file.originalname,
            fileHash,
            cloudinaryUrl:
                cloudinaryResult.secure_url,
            cloudinaryPublicId:
                cloudinaryResult.public_id
        });

        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        res.status(200).json({
            success: true,

            text: rawText,

            cloudinary: {
                url: cloudinaryResult.secure_url,
                publicId: cloudinaryResult.public_id
            }
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to parse document"
        });

    }
};