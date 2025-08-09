// controllers/chat.controller.js
import Chat from "../models/chat.models.js";

export const createChat = async (req, res) => {
  try {
    const userId = req.user._id;
    const { roomId, title } = req.body;
    
    // Validate title
    if (title && (typeof title !== 'string' || title.length > 100)) {
      return res.status(400).json({ error: "Title must be a string with max 100 characters" });
    }
    
    const chat = new Chat({
      roomId: roomId ?? `room-${Date.now()}`,
      userId,
      title: title || "Untitled",
      messages: [],
    });
    await chat.save();
    res.status(201).json(chat);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create chat" });
  }
};

export const addMessage = async (req, res) => {
  try {
    const userId = req.user._id;
    const { chatId, senderId, text, imageUri, fromAI } = req.body;

    // Validate message content
    if (!text && !imageUri) {
      return res.status(400).json({ error: "Message must contain either text or image" });
    }
    
    if (text && typeof text !== 'string') {
      return res.status(400).json({ error: "Text must be a string" });
    }
    
    if (text && text.length > 5000) {
      return res.status(400).json({ error: "Message text too long (max 5000 characters)" });
    }

    // If no chatId provided, create one
    if (!chatId) {
      const roomId = `room-${Date.now()}`;
      const chat = new Chat({
        roomId,
        userId,
        title: (text || "").split(" ").slice(0, 5).join(" ") || "Untitled",
        messages: [{ senderId, text, imageUri, fromAI: Boolean(fromAI) }],
        lastUpdated: Date.now(),
      });
      await chat.save();
      return res.status(201).json(chat);
    }

    const chat = await Chat.findOne({ _id: chatId, userId });
    if (!chat) return res.status(404).json({ message: "Chat not found" });

    chat.messages.push({ senderId, text, imageUri, fromAI: Boolean(fromAI) });
    chat.lastUpdated = Date.now();
    await chat.save();
    res.json(chat);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add message" });
  }
};

export const getRecentChats = async (req, res) => {
  try {
    const userId = req.user._id;
    const chats = await Chat.find({ userId })
      .sort({ lastUpdated: -1 })
      .limit(50)
      .lean();

    const summaries = chats.map((c) => ({
      chatId: c._id,
      roomId: c.roomId,
      title: c.title,
      firstMessage: c.messages?.[0] ?? null,
      firstMessageTime: c.messages?.[0]?.timestamp ?? null,
      lastUpdated: c.lastUpdated,
    }));

    res.json(summaries);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch recent chats" });
  }
};

export const getChatMessages = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const chat = await Chat.findOne({ _id: id, userId }).lean();
    if (!chat) return res.status(404).json({ message: "Chat not found" });
    res.json({
      chatId: chat._id,
      roomId: chat.roomId,
      title: chat.title,
      messages: chat.messages,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to get chat messages" });
  }
};

export const deleteChat = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    await Chat.deleteOne({ _id: id, userId });
    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete chat" });
  }
};
