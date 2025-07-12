const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const { validateChatMessage } = require('../middleware/validation');

router.post('/', validateChatMessage, chatController.sendMessage);

// Comprehensive Testing route (all 3 models)
router.post('/comprehensive-test', chatController.runComprehensiveTest);

// A/A Testing route
router.post('/aa-test', chatController.runAATest);

module.exports = router; 