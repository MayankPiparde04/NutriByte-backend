// middleware/logger.middleware.js
import { format } from 'util';

export const requestLogger = (req, res, next) => {
  const start = Date.now();
  const timestamp = new Date().toISOString();
  
  // Log the incoming request
  console.log(`[${timestamp}] ${req.method} ${req.url} - ${req.ip}`);
  
  // Override res.end to log the response
  const originalEnd = res.end;
  res.end = function(...args) {
    const duration = Date.now() - start;
    const statusCode = res.statusCode;
    const statusColor = statusCode >= 400 ? '\x1b[31m' : statusCode >= 300 ? '\x1b[33m' : '\x1b[32m';
    
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} - ${statusColor}${statusCode}\x1b[0m - ${duration}ms`);
    
    // Call the original end method
    originalEnd.apply(this, args);
  };
  
  next();
};

export const errorLogger = (err, req, res, next) => {
  const timestamp = new Date().toISOString();
  console.error(`[${timestamp}] ERROR ${req.method} ${req.url}:`, err.stack || err.message);
  next(err);
};
