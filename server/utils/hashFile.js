import fs from "fs";
import crypto from "crypto";

export const generateFileHash = (filePath) => {

    const fileBuffer =
        fs.readFileSync(filePath);

    return crypto
        .createHash("sha256")
        .update(fileBuffer)
        .digest("hex");
};