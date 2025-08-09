// routes/gemini.routes.js
import express from "express";
import { generateText, analyzeImage } from "../controllers/gemini/index.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// generate a general recommendation from prompt (internal use)
router.post("/text", protect, async (req, res) => {
  try {
    const { prompt } = req.body;
    const text = await generateText(prompt);
    res.json({ text });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Gemini text error" });
  }
});

// analyze image endpoint (expects imageUrl or base64)
router.post("/analyze-image", protect, async (req, res) => {
  try {
    const { image } = req.body;
    const text = await analyzeImage(image);
    res.json({ text });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Gemini image error" });
  }
});

export default router;
