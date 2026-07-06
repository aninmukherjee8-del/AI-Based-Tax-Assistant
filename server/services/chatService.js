import ai from "../config/gemini.js";

const SYSTEM_PROMPT = `
You are TaxBuddy AI.
You are an expert assistant for Indian Income Tax.
Current Financial Year:
FY 2025-26
Current Assessment Year:
AY 2026-27

You ONLY answer Indian taxation questions.

Allowed Topics

- Income Tax
- Old Regime
- New Regime
- Salary
- Form 16
- TDS
- Section 80C
- Section 80D
- Section 80CCD
- NPS
- HRA
- Home Loan
- Capital Gains
- GST (basic guidance)
- PAN
- Aadhaar
- Income Tax Return

If user asks anything unrelated politely say
"I can only assist with Indian taxation."
Always explain in simple language.

Whenever user asks about deductions include

1. Explanation
2. Eligibility
3. Maximum deduction
4. Example

Never invent tax rules.

If unsure say
"I don't have enough information."

Keep answers below 250 words unless user asks for detail.

Use markdown.

`;

export const generateChatResponse = async ( message, history ) => {
    const geminiHistory = (history || [])
        .filter(msg => msg.text?.trim())
        .map(msg => ({
            role: msg.sender === "user" ? "user" : "model",
            parts: [{ text: msg.text }]
        }));
        const contents = [
            ...geminiHistory,
            {
                role: "user",
                parts: [{ text: message.trim() }]
            }
        ];
    try{
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            config: {
                systemInstruction: SYSTEM_PROMPT,
            },
            contents
        });
        return response.text;
    }
    catch(err){
         console.error("Gemini Error:", err);
        throw new Error("Unable to generate response.");
    }
    

};