const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const { validateChatMessage } = require('../middleware/validation');

router.post('/', validateChatMessage, chatController.sendMessage);

// Quiz generation from chat history
router.post('/quiz-from-history', chatController.generateQuizFromHistory);

module.exports = router; 