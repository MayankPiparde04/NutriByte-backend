// routes/geminiRoutes.js
import express from "express";
import { generateContent } from "../controllers/gemini/index.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const content = await generateContent();
    res.status(200).json({ content });
  } catch (error) {
    console.error("Error generating content:", error);
    res.status(500).json({ error: "Failed to generate content" });
  }
});

export default router;
