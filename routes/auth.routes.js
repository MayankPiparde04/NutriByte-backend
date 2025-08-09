// routes/auth.routes.js
import express from "express";
import {
  registerController,
  loginController,
  refreshTokenController,
  logoutController,
} from "../controllers/auth.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", registerController);
router.post("/login", loginController);
router.post("/refresh", refreshTokenController); // cookie-based refresh
router.post("/logout", protect, logoutController);

export default router;
