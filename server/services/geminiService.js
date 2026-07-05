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

   const content = [`
You are a tax document parser.

Identify the document type.

Possible document types:
- form16
- payslip
- insurance_receipt
- rent_receipt
- elss_statement
- nps_statement
- bank_statement
- investment_proof
- other

Return ONLY valid JSON.

Use this exact schema:
{
  "documentType": "",

  "taxProfile": {
    "grossIncome": null,
    "deduction80C": null,
    "deduction80D": null,
    "npsContribution": null,
    "hraExemption": null,
    "tds": null
  },

  "documentData": {},

  "summary": ""
}

Rules:
- Missing values must be null.
- Monetary values must be numbers only.
- Do not include currency symbols.
- Do not include commas.
- Return valid JSON only.
- Do NOT wrap the response in markdown.
- Do NOT use markdown code fences.
- Return raw JSON only.
- The first character of the response must be {
- The last character of the response must be }
`

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
