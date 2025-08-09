// controllers/gemini/index.js
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const key = process.env.GEMINI_API_KEY;
if (!key) console.warn("GEMINI_API_KEY not set");

const genAI = new GoogleGenerativeAI(key);
const modelText = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function generateText(prompt, opts = {}) {
  const result = await modelText.generateContent(prompt, opts);
  const response = await result.response;
  return response.text();
}

// Example wrapper for image analysis (you can pass Cloudinary URL or base64)
export async function analyzeImage(imageUrlOrBase64) {
  // approach: send a text prompt to the model asking to parse the image at URL
  // Gemini image analysis APIs may require a different invocation; using generic prompt approach:
  const prompt = `Analyze the meal pictured at this URL: ${imageUrlOrBase64}.
Extract ingredients, approximate servings, and produce a nutrition summary (calories, protein, carbs, fat) where possible. Output JSON array with items.`;
  const text = await generateText(prompt);
  return text; // caller should parse / sanitize
}
