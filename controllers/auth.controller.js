// controllers/auth.controller.js
import User from "../models/user.models.js";
import jwt from "jsonwebtoken";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../middleware/auth.middleware.js";

const REFRESH_COOKIE_NAME = "nb_refresh";

export const registerController = async (req, res) => {
  try {
    const { fullname, email, password, phone } = req.body;
    
    // Validate required fields
    if (!fullname || !email || !password || !phone) {
      return res.status(400).json({ 
        message: "All fields are required",
        required: ["fullname", "email", "password", "phone"]
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Validate password strength
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }

    // Validate phone number (basic validation)
    if (phone.length < 10) {
      return res.status(400).json({ message: "Phone number must be at least 10 digits" });
    }

    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ message: "User with this email already exists" });

    // Check if phone number already exists (optional uniqueness)
    const phoneExists = await User.findOne({ phone });
    if (phoneExists) return res.status(409).json({ message: "User with this phone number already exists" });

    const user = new User({ fullname, email, password, phone });
    await user.save();

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Store refresh token with expiration
    user.refreshTokens.push({ 
      token: refreshToken, 
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
    });
    await user.save();

    res.cookie(REFRESH_COOKIE_NAME, refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
    });

    res.status(201).json({
      accessToken,
      user: user.getPublicProfile()
    });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ message: "Server error during registration" });
  }
};

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Email and password are required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid email or password" });
    
    const ok = await user.comparePassword(password);
    if (!ok) return res.status(401).json({ message: "Invalid email or password" });

    // Clean up expired tokens before creating new ones
    await user.cleanupExpiredTokens();

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshTokens.push({ 
      token: refreshToken, 
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
    });
    await user.save();

    res.cookie(REFRESH_COOKIE_NAME, refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24 * 30,
    });

    res.json({
      accessToken,
      user: user.getPublicProfile()
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error during login" });
  }
};

// POST /api/auth/refresh
export const refreshTokenController = async (req, res) => {
  try {
    const token = req.cookies[REFRESH_COOKIE_NAME];
    if (!token)
      return res.status(401).json({ message: "Missing refresh token" });

    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(decoded.id);
    if (!user)
      return res.status(401).json({ message: "Invalid refresh token" });

    // check token exists in DB
    const found = user.refreshTokens.find((rt) => rt.token === token);
    if (!found)
      return res.status(401).json({ message: "Refresh token not recognized" });

    // Optionally rotate refresh tokens - here we issue new pair and remove old
    const newAccess = generateAccessToken(user._id);
    const newRefresh = generateRefreshToken(user._id);

    // remove old token & push new
    user.refreshTokens = user.refreshTokens.filter((rt) => rt.token !== token);
    user.refreshTokens.push({ token: newRefresh, createdAt: new Date() });
    await user.save();

    res.cookie(REFRESH_COOKIE_NAME, newRefresh, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24 * 30,
    });

    res.json({ accessToken: newAccess });
  } catch (err) {
    console.error("refresh error", err);
    res.status(401).json({ message: "Invalid token" });
  }
};

export const logoutController = async (req, res) => {
  try {
    const token = req.cookies[REFRESH_COOKIE_NAME];
    if (token && req.user) {
      // remove token from DB if user attached (protect route can set req.user)
      const user = await User.findById(req.user._id);
      if (user) {
        user.refreshTokens = user.refreshTokens.filter(
          (rt) => rt.token !== token
        );
        await user.save();
      }
    }
    res.clearCookie(REFRESH_COOKIE_NAME, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });
    res.json({ message: "Logged out" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Logout error" });
  }
};
