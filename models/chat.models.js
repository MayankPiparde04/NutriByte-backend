// models/chat.models.js
import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // null or userId for system/AI
    text: { type: String },
    imageUri: { type: String }, // stored image url (Cloudinary / S3) or data-ref
    fromAI: { type: Boolean, default: false },
    timestamp: { type: Date, default: Date.now },
  },
  { _id: true }
);

const chatSchema = new mongoose.Schema(
  {
    roomId: { type: String, required: true }, // logical room id (e.g. session-xyz)
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, default: "Untitled" },
    messages: [messageSchema],
    lastUpdated: { type: Date, default: Date.now },
    isTemplate: { type: Boolean, default: false }, // for templated meal plans
  },
  { timestamps: true }
);

chatSchema.index({ userId: 1, lastUpdated: -1 });

export default mongoose.model("Chat", chatSchema);
