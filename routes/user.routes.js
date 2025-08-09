//routes/user.routes
import express from "express";
import {
  getUser,
  postUser,
  updateUser,
} from "../controllers/user.controller.js";

const router = express.Router();

router.get("/:id", getUser);
router.post("/", postUser);
router.put("/:id", updateUser);

export default router;
