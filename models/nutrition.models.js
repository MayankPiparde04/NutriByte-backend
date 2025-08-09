import mongoose from "mongoose";

const nutritionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: { type: Date, default: Date.now },
    meals: [
      // this will be fetched my gemini api dynamicly like sonth may have 5 some 10 /routes/gemini/ai
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Nutrition", nutritionSchema);
