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

let routes;
try {
  routes = require('./backend/routes');
} catch (error) {
  console.log('Routes not available:', error.message);
}

const allowedOrigins = [
  'https://study-buddy-c9d8.onrender.com',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:5001',
  'http://127.0.0.1:5001'
];

app.use(helmet({
  contentSecurityPolicy: false, 
  crossOriginEmbedderPolicy: false
}));

app.use(compression());

app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'production' ? 100 : 1000, // More lenient in development
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', limiter);

const corsOptions = {
  origin: function(origin, callback) {
    if (!origin) {
      return callback(null, true);
    }
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

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));


try {
  const speechRoutes = require('./backend/routes/speech');
  app.use('/api/speech', speechRoutes);
} catch (error) {
  app.post('/api/speech/transcribe-base64', (req, res) => {
    res.json({
      success: true,
      data: {
        transcript: "Speech-to-Text service is temporarily unavailable. Please type your question instead.",
        confidence: 0.95
      }
    });
  });
  
  app.post('/api/speech/transcribe', (req, res) => {
    res.json({
      success: true,
      data: {
        transcript: "Speech-to-Text service is temporarily unavailable. Please type your question instead.",
        confidence: 0.95
      }
    });
  });
}

const chatDbRoutes = require('./backend/routes/chatdb');
app.use('/api/chats', chatDbRoutes);


if (routes) {
  app.use('/api', routes);
}

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

app.use('/api/*', (req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'API route not found',
    path: req.originalUrl
  });
});

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
            health: '/api/health'
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
          health: '/api/health'
        }
      });
    });
  }
} else {

  app.get('/', (req, res) => {
    res.json({ 
      message: 'AI Study Buddy API is running!',
      environment: 'development',
      frontend: 'http://localhost:3000'
    });
  });
}

const server = app.listen(PORT, () => {
  console.log(`🚀 AI Study Buddy server running on port ${PORT}`);
  console.log(`📅 Environment: ${process.env.NODE_ENV || 'development'}`);
  if (process.env.NODE_ENV !== 'production') {
    console.log(`🌐 Frontend: http://localhost:3000`);
    console.log(`🔧 API: http://localhost:${PORT}/api`);
  }
});

process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

module.exports = app;
