import ai from "../config/gemini.js";
import { createPartFromUri } from "@google/genai";

export const extractDocument = async (filePath) => {
    const uploadedFile = await ai.files.upload({
        file: filePath,
        config: {
            displayName: "tax-document.pdf",
        },
    });

    let currentFile = await ai.files.get({ name: uploadedFile.name });

    while (currentFile.state === "PROCESSING") {
        console.log("Gemini processing...");
        await new Promise((resolve) => setTimeout(resolve, 3000));
        currentFile = await ai.files.get({ name: uploadedFile.name });

    }

    if (currentFile.state === "FAILED") {
        throw new Error("Gemini processing failed");
    }

    const content = [
        `
            Extract all text from this document.
            Preserve headings, tables, values, names, PAN numbers, and account numbers.
            Return ONLY valid JSON. Do not use markdown. Do not use backticks.
            Do not add explanations or any conversational text.
        `,
    ];
    if (currentFile.uri && currentFile.mimeType) {
        const currentFileContent = createPartFromUri(
            currentFile.uri,
            currentFile.mimeType,
        );
        content.push(currentFileContent);
    }
    console.log("Gemini processing...");
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: content,
    });
    console.log(response);
    return response.text;
};
