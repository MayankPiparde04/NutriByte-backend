// controllers/gemini/index.js
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const key = process.env.GEMINI_API_KEY;
if (!key) console.warn("GEMINI_API_KEY not set");

const genAI = new GoogleGenerativeAI(key);
const modelText = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
const modelVision = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function generateText(prompt, opts = {}) {
  if (!key) throw new Error("GEMINI_API_KEY not configured");
  const result = await modelText.generateContent(prompt, opts);
  const response = await result.response;
  return response.text();
}

// Improved image analysis that actually handles images
export async function analyzeImage(imageData) {
  if (!key) throw new Error("GEMINI_API_KEY not configured");
  
  try {
    let imagePart;
    
    // Handle different image input formats
    if (imageData.startsWith('data:image/')) {
      // Base64 data URL
      const [mimeType, base64Data] = imageData.split(',');
      const mimeTypeMatch = mimeType.match(/data:image\/(\w+);base64/);
      const imageType = mimeTypeMatch ? mimeTypeMatch[1] : 'jpeg';
      
      imagePart = {
        inlineData: {
          data: base64Data,
          mimeType: `image/${imageType}`
        }
      };
    } else if (imageData.startsWith('http')) {
      // Image URL - need to fetch and convert to base64
      const response = await fetch(imageData);
      const arrayBuffer = await response.arrayBuffer();
      const base64 = Buffer.from(arrayBuffer).toString('base64');
      const contentType = response.headers.get('content-type') || 'image/jpeg';
      
      imagePart = {
        inlineData: {
          data: base64,
          mimeType: contentType
        }
      };
    } else {
      throw new Error('Invalid image format. Please provide a data URL or HTTP URL.');
    }

    const prompt = `Analyze this food image and provide detailed nutritional information. 
    Please identify:
    1. All visible food items and ingredients
    2. Estimated portion sizes
    3. Approximate nutritional values (calories, protein, carbs, fat, fiber)
    4. Any cooking methods used
    5. Suggestions for improving nutritional balance
    
    Please format your response as a structured analysis that's easy to read.`;

    const result = await modelVision.generateContent([prompt, imagePart]);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error analyzing image:', error);
    throw new Error(`Image analysis failed: ${error.message}`);
  }
}
