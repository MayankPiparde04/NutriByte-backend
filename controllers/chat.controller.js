// controllers/chat.controller.js
import Chat from "../models/chat.models.js";

export const createChat = async (req, res) => {
  try {
    const userId = req.user._id;
    const { roomId, title } = req.body;
    const chat = new Chat({
      roomId: roomId ?? `room-${Date.now()}`,
      userId,
      title,
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

    // If no chatId provided, create one
    if (!chatId) {
      const roomId = `room-${Date.now()}`;
      const chat = new Chat({
        roomId,
        userId,
        title: (text || "").split(" ")[0] || "Untitled",
        messages: [{ senderId, text, imageUri, fromAI }],
        lastUpdated: Date.now(),
      });
      await chat.save();
      return res.status(201).json(chat);
    }

    const chat = await Chat.findOne({ _id: chatId, userId });
    if (!chat) return res.status(404).json({ message: "Chat not found" });

    chat.messages.push({ senderId, text, imageUri, fromAI });
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
