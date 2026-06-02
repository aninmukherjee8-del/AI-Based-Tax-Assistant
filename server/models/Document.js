import mongoose from "mongoose";

const documentSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
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
    uploadedAt: {
        type: Date,
        default: Date.now
    }
});

const Document = mongoose.model(
    "Document",
    documentSchema
);

export default Document;