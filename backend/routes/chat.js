const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const { validateChatMessage } = require('../middleware/validation');

router.post('/', validateChatMessage, chatController.sendMessage);

// Follow-up Testing route
router.post('/followup-test', chatController.runFollowUpTest);

module.exports = router; 