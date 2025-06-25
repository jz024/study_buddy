const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = parseInt(process.env.PORT) || 5001;

// Disable MongoDB for now - will add later
// let mongoose, connectDB, routes, errorHandler;

// try {
//   mongoose = require('mongoose');
//   connectDB = require('./backend/config/database');
//   routes = require('./backend/routes');
//   errorHandler = require('./backend/middleware/errorHandler');
// } catch (error) {
//   console.log('Some modules not available:', error.message);
// }

// Connect to MongoDB only if available and in production
// if (process.env.NODE_ENV === 'production' && connectDB && process.env.MONGODB_URI) {
//   try {
//     connectDB();
//   } catch (error) {
//     console.log('MongoDB connection failed:', error.message);
//   }
// }

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'", "https://api.openai.com", "http://localhost:3000", "http://localhost:5001"],
    },
  },
  crossOriginEmbedderPolicy: false
}));

// Compression middleware for better performance
app.use(compression());

// Logging middleware
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'production' ? 100 : 1000, // More lenient in development
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', limiter);

// CORS - more restrictive in production
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? [process.env.FRONTEND_URL || '*']
    : ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files for uploads (only if directory exists)
try {
  app.use('/uploads', express.static(path.join(__dirname, 'backend/uploads')));
} catch (error) {
  console.log('Uploads directory not available');
}

// API Routes (disabled for now)
// if (routes) {
//   app.use('/api', routes);
// }

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    mongodb: 'disabled',
    message: 'Server is running without database'
  });
});

// Simple test endpoint
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'Server is working!',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'development',
    database: 'disabled'
  });
});

// Serve static files from React build in production
if (process.env.NODE_ENV === 'production') {
  try {
    app.use(express.static(path.join(__dirname, 'frontend/build')));
    
    // Handle React routing, return all requests to React app
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'frontend/build', 'index.html'));
    });
  } catch (error) {
    console.log('Static files not available:', error.message);
    app.get('*', (req, res) => {
      res.json({ message: 'Frontend build not available' });
    });
  }
} else {
  // Development route
  app.get('/', (req, res) => {
    res.json({ 
      message: 'AI Study Buddy API is running!',
      environment: 'development',
      frontend: 'http://localhost:3000',
      database: 'disabled'
    });
  });
}

// Error handling middleware (simplified)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

// 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'API route not found',
    path: req.originalUrl
  });
});

// Only start server if not in serverless environment
if (process.env.NODE_ENV !== 'production' || process.env.VERCEL !== '1') {
  const server = app.listen(PORT, () => {
    console.log(`🚀 AI Study Buddy server running on port ${PORT}`);
    console.log(`📅 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🗄️ Database: Disabled`);
    if (process.env.NODE_ENV !== 'production') {
      console.log(`🌐 Frontend: http://localhost:3000`);
      console.log(`🔧 API: http://localhost:${PORT}/api`);
    }
  });

  // Graceful shutdown
  process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    server.close(() => {
      console.log('HTTP server closed');
      process.exit(0);
    });
  });
}

module.exports = app; 