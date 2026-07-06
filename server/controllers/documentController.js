import { extractText } from "../services/ocrService.js";
import { uploadDocument } from "../services/cloudinaryService.js";
import { extractDocument } from "../services/geminiService.js";
import Document from "../models/Document.js";
import { generateFileHash } from "../utils/hashFile.js";
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
        console.log("2. Hashing");
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
        console.log("3. Calling Gemini");
        let rawResponse =await extractDocument(filePath);
        console.log("4. Gemini finished");
        console.log("RAW GEMINI RESPONSE:");
        console.log(rawResponse);

        rawResponse = rawResponse
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

        const extractedText =
        JSON.parse(rawResponse);
        // console.log("Extracted Text");
        // return res.status(200).json({
        //     success: true,
        //     text: extractedText,
        // })
        // Temporary userId for testing
        // Replace with req.user.id once auth is added
        
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
            fileSize: req.file.size,
            cloudinaryUrl:
                cloudinaryResult.secure_url,
            cloudinaryPublicId:
                cloudinaryResult.public_id,
            extractedData: extractedText
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

        let grossIncome = 0;

        let deduction80C = 0;
        let deduction80D = 0;

        let npsContribution = 0;
        let hraExemption = 0;

        let tds = 0;
        documents.forEach((doc) => {
            const tax = doc.extractedData?.taxProfile;

                if (!tax) return;
                grossIncome = Math.max(
                grossIncome,
                tax.grossIncome || 0);
                deduction80C += tax.deduction80C || 0;

                deduction80D += tax.deduction80D || 0;

                npsContribution += tax.npsContribution || 0;

                hraExemption += tax.hraExemption || 0;

                tds += tax.tds || 0;

});
    res.status(200).json({
    success: true,

    documents,

    dashboard: {

        grossIncome,

        deduction80C,

        deduction80D,

        npsContribution,

        hraExemption,

        tds

    }

});

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch documents"
        });

    }
};