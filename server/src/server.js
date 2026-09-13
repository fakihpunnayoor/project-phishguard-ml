import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import apiRoutes from './routes/api.js';
import { connectDB } from './config/database.js';
import { notFoundHandler, errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Security & Parsing Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Logging Middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[HTTP] ${req.method} ${req.originalUrl} ${res.statusCode} (${duration}ms)`);
  });
  next();
});

// Mount API routes
app.use('/api', apiRoutes);

// Static Production Client Serving (for Unified Single-Service Deployment)
const clientDistPath = path.resolve(__dirname, '../../client/dist');
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
} else {
  // Fallback root endpoint when running API standalone in development
  app.get('/', (req, res) => {
    res.json({
      name: 'PhishGuard Threat Intelligence API',
      status: 'ONLINE',
      documentation: '/api/health',
      version: '1.0.0'
    });
  });
}

// Error Handling Middlewares
app.use(notFoundHandler);
app.use(errorHandler);

// Start Server and connect DB
const startServer = () => {
  const server = app.listen(PORT, () => {
    console.log(`🚀 [PhishGuard Server] Listening on http://localhost:${PORT}`);
    console.log(`📡 [API Endpoints] /api/scan, /api/history, /api/stats, /api/health`);
  });

  // Connect to DB asynchronously (with fallback)
  connectDB().catch(() => {});

  return server;
};

startServer();

export default app;
