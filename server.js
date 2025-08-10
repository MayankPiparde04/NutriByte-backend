// server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import os from "os";
import connect from "./controllers/db/db.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import chatRoutes from "./routes/chat.routes.js";
import geminiRoutes from "./routes/gemini.routes.js";
import { requestLogger, errorLogger } from "./middleware/logger.middleware.js";

dotenv.config();

// Function to get all network interface IPs
function getNetworkIPs() {
  const interfaces = os.networkInterfaces();
  const ips = [];
  
  Object.keys(interfaces).forEach((interfaceName) => {
    interfaces[interfaceName].forEach((iface) => {
      // Skip internal and non-IPv4 addresses
      if (!iface.internal && iface.family === 'IPv4') {
        ips.push({
          interface: interfaceName,
          ip: iface.address
        });
      }
    });
  });
  
  return ips;
}

// Validate required environment variables
const requiredEnvVars = ['JWT_SECRET', 'REFRESH_TOKEN_SECRET']; // Removed MONGO_URI from required
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.error('❌ Missing required environment variables:', missingEnvVars);
  console.error('Please check your .env file and ensure all required variables are set.');
  process.exit(1);
}

// Connect to MongoDB (graceful failure)
const dbConnected = await connect();

const app = express();
const PORT = process.env.PORT ?? 5000;

// Request logging middleware
app.use(requestLogger);

const allowedOrigin = process.env.FRONTEND_ORIGIN ?? "http://localhost:3000";

app.use(
  cors({
    origin: allowedOrigin || "*", // if allowedOrigin is falsy, fallback to '*'
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/gemini", geminiRoutes);

// 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ error: 'API endpoint not found' });
});

// Error logging middleware
app.use(errorLogger);

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  
  // Don't leak error details in production
  const errorMessage = process.env.NODE_ENV === 'production' 
    ? 'Internal Server Error' 
    : err.message;
    
  res
    .status(err.status || 500)
    .json({ error: errorMessage });
});

// Graceful shutdown handling
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received. Shutting down gracefully...');
  process.exit(0);
});

app.listen(PORT, () => {
  console.log('\n🚀 NutriByte API Server Started Successfully!');
  console.log('='.repeat(60));
  
  // Database status
  console.log(`💾 Database: ${dbConnected ? '✅ Connected' : '❌ Disconnected'}`);
  
  // Get network IPs
  const networkIPs = getNetworkIPs();
  
  // Log localhost
  console.log(`📍 Localhost: http://localhost:${PORT}`);
  console.log(`🏥 Health Check: http://localhost:${PORT}/api/health`);
  
  // Log network IPs
  if (networkIPs.length > 0) {
    console.log('\n📶 Network Access:');
    networkIPs.forEach(({ interface: interfaceName, ip }) => {
      console.log(`   ${interfaceName}: http://${ip}:${PORT}`);
      console.log(`   Health Check: http://${ip}:${PORT}/api/health`);
    });
    
    console.log('\n📱 For Mobile Development:');
    console.log(`   iOS Simulator: http://localhost:${PORT}/api`);
    console.log(`   Android Emulator: http://10.0.2.2:${PORT}/api`);
    if (networkIPs.length > 0) {
      const primaryIP = networkIPs[0].ip;
      console.log(`   Physical Device: http://${primaryIP}:${PORT}/api`);
    }
  }
  
  console.log('\n🌐 CORS Configuration:');
  console.log(`   Allowed Origin: ${allowedOrigin || '*'}`);
  
  console.log('\n📊 API Documentation: ./API_DOCUMENTATION.md');
  console.log('='.repeat(60));
});
