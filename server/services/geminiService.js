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
You are an expert AI tax document parser for Indian Income Tax.

Your task is to extract structured information from a tax-related document.

----------------------------
SUPPORTED DOCUMENT TYPES
----------------------------

Possible values for "documentType":

- form16
- payslip
- insurance_receipt
- rent_receipt
- elss_statement
- nps_statement
- bank_statement
- investment_proof
- other

----------------------------
OUTPUT FORMAT
----------------------------

Return ONLY valid JSON.

Do NOT use markdown.

Do NOT use code fences.

Do NOT explain anything.

The first character MUST be {

The last character MUST be }

Return exactly this structure:

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

  "documentData": {

  },

  "summary": ""
}

----------------------------
GENERAL RULES
----------------------------

- Missing values MUST be null.
- Monetary values MUST be numbers only.
- Never include ₹, commas or text.
- Dates should remain exactly as written in the document unless specified otherwise.
- Do not invent values.
- If a field does not exist, return null.
- Return raw JSON only.

----------------------------
DOCUMENT-SPECIFIC RULES
----------------------------

### 1. payslip

Return documentData as:

{
  "employeeName": "",
  "salaryMonth": "",
  "salaryYear": null,
  "dateOfJoining": "",
  "employeeId": "",
  "uanNo": "",
  "esicNo": "",
  "basicSalary": null,
  "hra": null,
  "allowances": null,
  "overtime": null,
  "bonus": null,
  "grossSalary": null,
  "epf": null,
  "esic": null,
  "professionalTax": null,
  "loanDeduction": null,
  "otherDeductions": null,
  "totalDeductions": null,
  "netSalary": null,
  "paymentMethod": "",
  "paymentDate": ""
}

IMPORTANT:

Always return salaryMonth as "MONTH YEAR"

Example:

"AUGUST 2023"
NOT
month + year
NOT
08/2023
NOT
Aug-23
NOT
August-2023

----------------------------

### 2. form16

Return:

{
  "employeeName":"",
  "employerName":"",
  "pan":"",
  "tan":"",
  "financialYear":"",
  "assessmentYear":"",
  "grossSalary":null,
  "totalExemptions":null,
  "totalDeductions":null,
  "taxableIncome":null,
  "totalTax":null,
  "tdsDeducted":null
}

----------------------------

### 3. insurance_receipt

Return:

{
  "policyHolder":"",
  "insurer":"",
  "policyNumber":"",
  "premiumPaid":null,
  "policyType":"",
  "paymentDate":""
}

----------------------------

### 4. rent_receipt

Return:

{
  "tenant":"",
  "landlord":"",
  "rentMonth":"",
  "rentPaid":null,
  "propertyAddress":""
}

----------------------------

### 5. bank_statement

Return:

{
  "bankName":"",
  "accountNumber":"",
  "statementPeriod":"",
  "interestEarned":null
}

----------------------------

### 6. investment_proof

Return:

{
  "investmentType":"",
  "investmentName":"",
  "investmentAmount":null
}

----------------------------

### 7. elss_statement

Return:

{
  "fundName":"",
  "investmentAmount":null,
  "investmentDate":""
}

----------------------------

### 8. nps_statement

Return:

{
  "pran":"",
  "contribution":null,
  "financialYear":""
}

----------------------------

The "summary" should contain a concise 2-3 sentence description of the document and the important tax-related information extracted.
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
        model: "gemini-3.5-flash",
        contents: content,
    });
    console.log(response);
    return response.text;
};
