const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { createServer } = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const config = require('./config/database');
const logger = require('./utils/logger');
const rateLimiter = require('./middleware/rateLimiter');
const errorHandler = require('./middleware/errorHandler');
const authMiddleware = require('./middleware/auth');

// Import routes
const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');
const prdRoutes = require('./routes/prd');
const nfrRoutes = require('./routes/nfr');
const storyRoutes = require('./routes/stories');
const aiRoutes = require('./routes/ai');
const integrationRoutes = require('./routes/integrations');

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGINS?.split(',') || ["http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
});

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGINS?.split(',') || ["http://localhost:3000"],
  credentials: true
}));

// Request parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Logging
app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));

// Rate limiting
app.use('/api', rateLimiter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', authMiddleware, projectRoutes);
app.use('/api/prd', authMiddleware, prdRoutes);
app.use('/api/nfr', authMiddleware, nfrRoutes);
app.use('/api/stories', authMiddleware, storyRoutes);
app.use('/api/ai', authMiddleware, aiRoutes);
app.use('/api/integrations', authMiddleware, integrationRoutes);

// WebSocket handling for real-time collaboration
io.use((socket, next) => {
  // WebSocket authentication middleware
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error('Authentication error'));
  }
  
  try {
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = decoded.userId;
    socket.userEmail = decoded.email;
    next();
  } catch (err) {
    next(new Error('Authentication error'));
  }
});

io.on('connection', (socket) => {
  logger.info(`User connected: ${socket.userEmail} (${socket.userId})`);
  
  // Join project room for collaboration
  socket.on('join-project', (projectId) => {
    socket.join(`project-${projectId}`);
    socket.to(`project-${projectId}`).emit('user-joined', {
      userId: socket.userId,
      email: socket.userEmail,
      timestamp: new Date().toISOString()
    });
  });
  
  // Handle document editing events
  socket.on('document-change', (data) => {
    socket.to(`project-${data.projectId}`).emit('document-change', {
      ...data,
      userId: socket.userId,
      userEmail: socket.userEmail,
      timestamp: new Date().toISOString()
    });
  });
  
  // Handle cursor position updates
  socket.on('cursor-position', (data) => {
    socket.to(`project-${data.projectId}`).emit('cursor-position', {
      ...data,
      userId: socket.userId,
      userEmail: socket.userEmail
    });
  });
  
  // Handle comments
  socket.on('add-comment', (data) => {
    socket.to(`project-${data.projectId}`).emit('new-comment', {
      ...data,
      userId: socket.userId,
      userEmail: socket.userEmail,
      timestamp: new Date().toISOString()
    });
  });
  
  socket.on('disconnect', () => {
    logger.info(`User disconnected: ${socket.userEmail} (${socket.userId})`);
  });
});

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found',
    path: req.originalUrl
  });
});

const PORT = process.env.PORT || 3001;
const HOST = process.env.HOST || 'localhost';

server.listen(PORT, HOST, () => {
  logger.info(`🚀 AI-SDLC Platform Backend running on http://${HOST}:${PORT}`);
  logger.info(`📝 API Documentation available at http://${HOST}:${PORT}/api/docs`);
  logger.info(`🔧 Health check available at http://${HOST}:${PORT}/health`);
  logger.info(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  server.close(() => {
    logger.info('Process terminated');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  server.close(() => {
    logger.info('Process terminated');
    process.exit(0);
  });
});

module.exports = { app, server, io };