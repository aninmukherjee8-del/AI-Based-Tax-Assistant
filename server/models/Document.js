import mongoose from "mongoose";

const documentSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    documentType:{
        type:String,
        enum:[
            "form16",
            "payslip",
            "insurance_receipt",
            "rent_receipt",
            "elss_statement",
            "nps_statement",
            "bank_statement",
            "investment_proof",
            "other"
        ]
    },
    originalFileName: {
        type: String,
        required: true
    },
    fileHash: {
        type: String,
        required: true,
        index: true
    },
    cloudinaryUrl: {
        type: String,
        required: true
    },
    cloudinaryPublicId: {
        type: String,
        required: true
    },
    extractedData:{
        type:mongoose.Schema.Types.Mixed,
        default:{}
    },
    fileSize:{
        type:Number,
        default:0
    },
    uploadedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

const Document = mongoose.model(
    "Document",
    documentSchema
);

export default Document;