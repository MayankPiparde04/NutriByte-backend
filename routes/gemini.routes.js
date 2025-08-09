// routes/gemini.routes.js
import express from "express";
import { generateText, analyzeImage } from "../controllers/gemini/index.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// generate a general recommendation from prompt (internal use)
router.post("/text", protect, async (req, res) => {
  try {
    const { prompt } = req.body;
    
    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      return res.status(400).json({ error: "Valid prompt is required" });
    }
    
    if (prompt.length > 10000) {
      return res.status(400).json({ error: "Prompt too long (max 10000 characters)" });
    }
    
    const text = await generateText(prompt);
    res.json({ text });
  } catch (err) {
    console.error('Gemini text generation error:', err);
    res.status(500).json({ error: err.message || "Gemini text error" });
  }
});

// analyze image endpoint (expects imageUrl or base64)
router.post("/analyze-image", protect, async (req, res) => {
  try {
    const { image } = req.body;
    
    if (!image || typeof image !== 'string') {
      return res.status(400).json({ error: "Image data is required" });
    }
    
    // Basic validation for image format
    if (!image.startsWith('data:image/') && !image.startsWith('http')) {
      return res.status(400).json({ error: "Invalid image format. Please provide a data URL or HTTP URL." });
    }
    
    const text = await analyzeImage(image);
    res.json({ text });
  } catch (err) {
    console.error('Gemini image analysis error:', err);
    res.status(500).json({ error: err.message || "Gemini image error" });
  }
});

export default router;
