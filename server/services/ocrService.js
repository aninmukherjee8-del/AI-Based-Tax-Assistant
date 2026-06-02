import fs from "fs";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";

export const extractText = async (filePath) => {
    const data = new Uint8Array(fs.readFileSync(filePath));

    const pdf = await pdfjsLib.getDocument({ data }).promise;

    let text = "";

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);

        const content = await page.getTextContent();

        const pageText = content.items
            .map(item => item.str)
            .join(" ");

        text += pageText + "\n";
    }

    return text;
};