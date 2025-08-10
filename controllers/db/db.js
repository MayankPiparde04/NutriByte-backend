// controllers/db/db.js
import mongoose from "mongoose";

const connect = async () => {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) {
      console.warn("⚠️  MONGO_URI not defined. Database features will be unavailable.");
      return false;
    }
    
    await mongoose.connect(uri, {
      dbName: process.env.MONGO_DBNAME ?? "nutribyte",
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    });
    console.log("✅ MongoDB connected successfully");
    return true;
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    console.warn("⚠️  Continuing without database. Some features may not work.");
    return false;
  }
};

export default connect;
