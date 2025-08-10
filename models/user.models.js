// models/user.models.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  // Required fields for signup
  fullname: { type: String, required: true, trim: true },
  phone: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6 },
  
  // Optional fields - added later via profile page
  age: { type: Number, min: 1, max: 120 },
  height: { type: Number, min: 1, max: 300 }, // in cm
  weight: { type: Number, min: 1, max: 1000 }, // in kg
  
  // Automatic system fields (handled by auth system)
  refreshTokens: [{ 
    token: String, 
    createdAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) } // 30 days
  }],
}, { 
  timestamps: true // Adds createdAt and updatedAt automatically
});

// Note: Index on email is automatically created due to unique: true

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(12); // Increased salt rounds for better security
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

// Method to clean up expired refresh tokens
userSchema.methods.cleanupExpiredTokens = function() {
  this.refreshTokens = this.refreshTokens.filter(
    rt => rt.expiresAt > new Date()
  );
  return this.save();
};

// Method to get user profile data (excluding sensitive info)
userSchema.methods.getPublicProfile = function() {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.refreshTokens;
  // Add id field for frontend consistency
  userObject.id = userObject._id;
  return userObject;
};

export default mongoose.model("User", userSchema);
