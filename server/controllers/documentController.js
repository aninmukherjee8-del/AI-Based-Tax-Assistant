import { extractText } from "../services/ocrService.js";
import { uploadDocument } from "../services/cloudinaryService.js";
import { extractDocument } from "../services/geminiService.js";
import Document from "../models/Document.js";
import { generateFileHash } from "../utils/hashFile.js";
import { updateTaxProfile } from "../services/taxProfileService.js";
import TaxProfile from "../models/taxProfile.js";
import fs from "fs";

export const parseDocument = async (req, res) => {
    let filePath;
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No file uploaded"
            });
        }
        console.log("1. File received");
        filePath = req.file.path;
        const fileHash = generateFileHash(filePath);
        const userId = req.user.id;
        const existingDocument =
            await Document.findOne({
                userId,
                fileHash
            });

        if (existingDocument) {
            return res.status(200).json({
                success: true,
                alreadyUploaded: true,
                document: existingDocument
            });
        }
        // Existing PDF text extraction
        // const rawText = await extractText(filePath);
        console.log("2. Calling Gemini");
        let rawResponse =await extractDocument(filePath);
        console.log("3. Gemini finished");
        console.log("RAW GEMINI RESPONSE:");
        console.log(rawResponse);

        rawResponse = rawResponse
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

        const extractedText =
        JSON.parse(rawResponse);
        
        const cloudinaryResult = await uploadDocument(
            filePath,
            userId
        );

        const document =
        await Document.create({
            userId,
            documentType: extractedText.documentType
            ?.trim()
            .toLowerCase()
            .replace(/\s+/g, "_")
            .replace(/-/g, "_"),
            originalFileName: req.file.originalname,
            fileHash,
            fileSize: req.file.size,
            cloudinaryUrl: cloudinaryResult.secure_url,
            cloudinaryPublicId: cloudinaryResult.public_id,
            extractedData: extractedText
        });

        await updateTaxProfile({
            userId,
            document,
            extractedData: extractedText,
            originalFileName: req.file.originalname
        });

        res.status(200).json({
            success: true,
            text: extractedText,
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
    finally{
        if (filePath && fs.existsSync(filePath)) {
            try {
                fs.unlinkSync(filePath);
                console.log("Deleted:", filePath);
            } catch (err) {
                console.error("Delete failed:", err);
            }
        }
    }

        
};

export const getUserDocuments = async (req, res) => {
    try {
        const documents = await Document.find({
            userId: req.user.id
        }).sort({ createdAt: -1 });
        const profile = await TaxProfile.findOne({
            user: req.user.id,
            financialYear: "2026-27"
        });
        res.status(200).json({
            success: true,
            documents,
            taxProfile: profile
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch documents"
        });
    }
};
