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
let mongoose, connectDB, routes, errorHandler;

try {
  mongoose = require('mongoose');
  connectDB = require('./backend/config/database');
  routes = require('./backend/routes');
  errorHandler = require('./backend/middleware/errorHandler');
} catch (error) {
  console.log('Some modules not available:', error.message);
}

// Connect to MongoDB only if available and in production
if (process.env.NODE_ENV === 'production' && connectDB && process.env.MONGODB_URI) {
  try {
    connectDB();
  } catch (error) {
    console.log('MongoDB connection failed:', error.message);
  }
}

const allowedOrigins = [
  'https://study-buddy-c9d8.onrender.com',
  'http://localhost:3000',
  'http://127.0.0.1:3000'
];

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false, // Temporarily disabled for Firebase
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

// CORS - allow only allowedOrigins
const corsOptions = {
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  },
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

// API Routes
if (routes) {
  app.use('/api', routes);
}

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

// Simple chat endpoint (placeholder until full backend is enabled)
app.post('/api/chat', async (req, res) => {
  try {
    const { message, subjectId } = req.body;
    
    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Message is required'
      });
    }

    // For now, return a simple response
    // Later, this will integrate with OpenAI
    const aiResponse = `I received your message: "${message}". This is a placeholder response. The full AI integration will be enabled soon!`;
    
    res.json({
      success: true,
      data: {
        userMessage: message,
        aiResponse: aiResponse,
        timestamp: new Date().toISOString(),
        subjectId: subjectId
      }
    });
  } catch (error) {
    console.error('Chat endpoint error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Simple auth endpoints (placeholder until full backend is enabled)
app.post('/api/auth/signup', (req, res) => {
  res.json({
    success: true,
    message: 'Signup endpoint reached. Firebase handles authentication on the frontend.',
    data: {
      user: { id: 'placeholder-user-id' },
      token: 'placeholder-token'
    }
  });
});

app.post('/api/auth/signin', (req, res) => {
  res.json({
    success: true,
    message: 'Signin endpoint reached. Firebase handles authentication on the frontend.',
    data: {
      user: { id: 'placeholder-user-id' },
      token: 'placeholder-token'
    }
  });
});

app.post('/api/auth/signout', (req, res) => {
  res.json({
    success: true,
    message: 'Signout successful'
  });
});

// Serve static files from React build in production
if (process.env.NODE_ENV === 'production') {
  try {
    const publicPath = path.join(__dirname, 'public');
    const indexPath = path.join(publicPath, 'index.html');
    
    // Check if public directory and index.html exist
    if (require('fs').existsSync(indexPath)) {
      // Serve static files from the public directory (created by build script)
      app.use(express.static(publicPath));
      
      // Handle React routing, return all requests to React app
      app.get('*', (req, res) => {
        res.sendFile(indexPath);
      });
    } else {
      console.log('Frontend build not found, serving fallback');
      app.get('*', (req, res) => {
        res.json({ 
          message: 'Frontend build not available',
          status: 'Please ensure the frontend is built before deployment',
          api: {
            health: '/api/health',
            test: '/api/test'
          },
          error: 'index.html not found in public directory'
        });
      });
    }
  } catch (error) {
    console.log('Static files not available:', error.message);
    app.get('*', (req, res) => {
      res.json({ 
        message: 'Frontend build not available',
        error: error.message,
        api: {
          health: '/api/health',
          test: '/api/test'
        }
      });
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

// Start server
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

module.exports = app;