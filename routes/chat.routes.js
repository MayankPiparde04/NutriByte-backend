// routes/chat.routes.js
import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import {
  createChat,
  addMessage,
  getRecentChats,
  getChatMessages,
  deleteChat,
} from "../controllers/chat.controller.js";

const router = express.Router();

router.get("/recent", protect, getRecentChats);
router.post("/", protect, createChat);
router.post("/message", protect, addMessage);
router.get("/:id/messages", protect, getChatMessages);
router.delete("/:id", protect, deleteChat);

export default router;
