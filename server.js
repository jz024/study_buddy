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
  'http://127.0.0.1:3000',
  'http://localhost:5001',
  'http://127.0.0.1:5001'
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
    console.log('CORS origin check:', origin);
    // Allow requests with no origin (like mobile apps, curl, etc.)
    if (!origin) {
      console.log('No origin - allowing request');
      return callback(null, true);
    }
    if (allowedOrigins.includes(origin)) {
      console.log('Origin allowed:', origin);
      return callback(null, true);
    } else {
      console.log('Origin not allowed:', origin);
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

// Speech-to-Text routes
console.log('Attempting to load speech routes...');
try {
  const speechRoutes = require('./backend/routes/speech');
  console.log('Speech routes loaded successfully');
  app.use('/api/speech', speechRoutes);
  console.log('Speech routes registered at /api/speech');
} catch (error) {
  console.log('Speech routes not available:', error.message);
  console.log('Speech routes error details:', error);
  
  // Fallback speech routes if the main speech routes fail to load
  console.log('Setting up fallback speech routes...');
  app.post('/api/speech/transcribe-base64', (req, res) => {
    console.log('Fallback speech route hit');
    res.json({
      success: true,
      data: {
        transcript: "Speech-to-Text service is temporarily unavailable. Please type your question instead.",
        confidence: 0.95
      }
    });
  });
  
  app.post('/api/speech/transcribe', (req, res) => {
    console.log('Fallback speech file route hit');
    res.json({
      success: true,
      data: {
        transcript: "Speech-to-Text service is temporarily unavailable. Please type your question instead.",
        confidence: 0.95
      }
    });
  });
  
  app.get('/api/speech/test', (req, res) => {
    res.json({
      success: true,
      message: 'Fallback speech test endpoint is working',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
    });
  });
}

// Add a test endpoint to verify speech routes are working
app.get('/api/speech-test', (req, res) => {
  console.log('Speech test endpoint hit');
  res.json({
    success: true,
    message: 'Speech test endpoint is working',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Add a debug endpoint to check Google Cloud configuration
app.get('/api/speech-debug', (req, res) => {
  const hasProjectId = !!process.env.GOOGLE_CLOUD_PROJECT_ID;
  const hasKeyFile = !!process.env.GOOGLE_CLOUD_KEY_FILE;
  const hasPrivateKey = !!process.env.GOOGLE_CLOUD_PRIVATE_KEY;
  const hasClientEmail = !!process.env.GOOGLE_CLOUD_CLIENT_EMAIL;
  
  res.json({
    success: true,
    message: 'Google Cloud Speech-to-Text Configuration Debug',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    config: {
      hasProjectId,
      hasKeyFile,
      hasPrivateKey,
      hasClientEmail,
      projectId: process.env.GOOGLE_CLOUD_PROJECT_ID ? 'Set' : 'Not set',
      keyFile: process.env.GOOGLE_CLOUD_KEY_FILE || 'Not set',
      clientEmail: process.env.GOOGLE_CLOUD_CLIENT_EMAIL || 'Not set'
    },
    status: (hasProjectId && (hasKeyFile || (hasPrivateKey && hasClientEmail))) ? 'Configured' : 'Not configured'
  });
});

// Add a test endpoint that directly tests the speech service
app.get('/api/speech-test-service', async (req, res) => {
  try {
    const speechService = require('./backend/services/speechToTextService');
    const testBuffer = Buffer.from('test audio data');
    
    const result = await speechService.transcribeAudio(
      testBuffer,
      'audio/webm;codecs=opus',
      48000,
      'en-US'
    );
    
    res.json({
      success: true,
      message: 'Speech service test completed',
      result: result,
      hasClient: !!speechService.client,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.json({
      success: false,
      message: 'Speech service test failed',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

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

// Serve static files from React build in production (MOVED TO END)
if (process.env.NODE_ENV === 'production') {
  try {
    const publicPath = path.join(__dirname, 'public');
    const indexPath = path.join(publicPath, 'index.html');
    
    if (require('fs').existsSync(indexPath)) {
      app.use(express.static(publicPath));
      // React catch-all: must be LAST
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
