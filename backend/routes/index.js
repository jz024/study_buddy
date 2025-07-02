const express = require('express');
const router = express.Router();
const chatRoutes = require('./chat');

router.use('/chat', chatRoutes);

router.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

module.exports = router; 