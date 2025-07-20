const express = require('express');
const router = express.Router();
const pool = require('../db');
const openaiService = require('../services/openaiService');
const llamaService = require('../services/llamaService');

router.post('/', async (req, res) => {
  const { user_id, subject, llm, title } = req.body;
  if (llm !== 'openai' && llm !== 'llama') {
    return res.status(400).json({ success: false, message: 'Only openai and llama are supported.' });
  }
  try {
    const result = await pool.query(
      'INSERT INTO chats (user_id, subject, llm, title) VALUES ($1, $2, $3, $4) RETURNING *',
      [user_id, subject, llm, title || null]
    );
    res.json({ success: true, chat: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/', async (req, res) => {
  const { user_id } = req.query;
  try {
    const result = await pool.query(
      'SELECT * FROM chats WHERE user_id = $1 ORDER BY created_at DESC',
      [user_id]
    );
    res.json({ success: true, chats: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/:chat_id/messages', async (req, res) => {
  const { chat_id } = req.params;
  try {
    const result = await pool.query(
      'SELECT * FROM messages WHERE chat_id = $1 ORDER BY created_at ASC',
      [chat_id]
    );
    res.json({ success: true, messages: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/:chat_id/messages', async (req, res) => {
  const { chat_id } = req.params;
  const { sender, content } = req.body;
  try {
    await pool.query(
      'INSERT INTO messages (chat_id, sender, content) VALUES ($1, $2, $3)',
      [chat_id, sender, content]
    );

    const contextResult = await pool.query(
      'SELECT sender, content FROM messages WHERE chat_id = $1 ORDER BY created_at ASC LIMIT 20',
      [chat_id]
    );
    const history = contextResult.rows.map(m => ({
      role: m.sender === 'user' ? 'user' : 'assistant',
      content: m.content
    }));
    // Get chat info for model selection
    const chatResult = await pool.query('SELECT * FROM chats WHERE id = $1', [chat_id]);
    const chat = chatResult.rows[0];
    let response;
    if (chat.llm === 'llama') {
      response = await llamaService.generateChatResponse(history);
    } else {
      response = await openaiService.generateChatResponse(history);
    }
    // Insert assistant response
    await pool.query(
      'INSERT INTO messages (chat_id, sender, content) VALUES ($1, $2, $3)',
      [chat_id, 'assistant', response.content]
    );
    res.json({ success: true, aiResponse: response.content });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router; 