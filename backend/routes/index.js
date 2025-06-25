const express = require('express');
const router = express.Router();

// Import route modules
const authRoutes = require('./auth');
const subjectRoutes = require('./subjects');
const noteRoutes = require('./notes');
const chatRoutes = require('./chat');
const flashcardRoutes = require('./flashcards');
const quizRoutes = require('./quizzes');

// API routes
router.use('/auth', authRoutes);
router.use('/subjects', subjectRoutes);
router.use('/notes', noteRoutes);
router.use('/chat', chatRoutes);
router.use('/flashcards', flashcardRoutes);
router.use('/quizzes', quizRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

module.exports = router; 