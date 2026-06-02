import cloudinary from "../config/cloudinary.js";

export const uploadDocument = async (
    filePath,
    userId
) => {

    return await cloudinary.uploader.upload(
        filePath,
        {
            resource_type: "raw",
            folder: `users/${userId}/documents`
        }
    );
};