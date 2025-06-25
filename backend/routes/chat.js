const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const { validateChatMessage } = require('../middleware/validation');

// Temporarily removing auth for testing - add back later
// const auth = require('../middleware/auth');
// router.use(auth);

router.post('/', validateChatMessage, chatController.sendMessage);

module.exports = router; 