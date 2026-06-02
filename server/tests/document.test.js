import { extractText } from "../services/ocrService.js";

const text = await extractText("./sample.pdf");

console.log(text);