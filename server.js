import express from "express";
import dotenv from "dotenv";
import geminiRoutes from "./routes/geminiRoutes.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use("/api/gemini", geminiRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
