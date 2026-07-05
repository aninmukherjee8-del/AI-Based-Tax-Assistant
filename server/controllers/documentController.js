import { extractText } from "../services/ocrService.js";
import { uploadDocument } from "../services/cloudinaryService.js";
import { extractDocument } from "../services/geminiService.js";
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
        // const rawText = await extractText(filePath);
        let rawResponse =
        await extractDocument(filePath);

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
        const userId = req.user.id;
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
            fileSize: req.file.size,
            cloudinaryUrl:
                cloudinaryResult.secure_url,
            cloudinaryPublicId:
                cloudinaryResult.public_id,
            extractedData: extractedText
        });

        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

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