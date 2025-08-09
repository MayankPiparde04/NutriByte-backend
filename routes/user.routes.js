//routes/user.routes
import express from "express";
import {
  getUser,
  postUser,
  updateUser,
} from "../controllers/user.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/:id", protect, getUser);
router.post("/", protect, postUser);
router.put("/:id", protect, updateUser);

export default router;
