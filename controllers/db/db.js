// controllers/db/db.js
import mongoose from "mongoose";

const connect = async () => {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) throw new Error("MONGO_URI not defined");
    await mongoose.connect(uri, {
      dbName: process.env.MONGO_DBNAME ?? "nutribyte",
    });
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("Mongo connect error:", err);
    process.exit(1);
  }
};

export default connect;
