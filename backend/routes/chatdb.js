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
    console.error('Error in /api/chats POST:', err);
    res.status(500).json({ success: false, message: err.message, stack: err.stack });
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
    const chatResult = await pool.query('SELECT * FROM chats WHERE id = $1', [chat_id]);
    const chat = chatResult.rows[0];
    
    if (!chat) {
      return res.status(404).json({ success: false, message: 'Chat not found' });
    }

    const result = await pool.query(`
      SELECT m.* 
      FROM messages m
      JOIN chats c ON m.chat_id = c.id
      WHERE c.user_id = $1 
      AND c.subject = $2 
      AND m.model = $3
      ORDER BY m.created_at ASC
    `, [chat.user_id, chat.subject, chat.llm]);
    
    res.json({ success: true, messages: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/:chat_id/messages', async (req, res) => {
  const { chat_id } = req.params;
  const { sender, content } = req.body;
  try {
    const chatResult = await pool.query('SELECT * FROM chats WHERE id = $1', [chat_id]);
    const chat = chatResult.rows[0];
    
    if (!chat) {
      return res.status(404).json({ success: false, message: 'Chat not found' });
    }

    await pool.query(
      'INSERT INTO messages (chat_id, sender, content, model) VALUES ($1, $2, $3, $4)',
      [chat_id, sender, content, chat.llm]
    );

    const contextResult = await pool.query(`
      SELECT m.sender, m.content 
      FROM messages m
      JOIN chats c ON m.chat_id = c.id
      WHERE c.user_id = $1 
      AND c.subject = $2 
      AND m.model = $3
      ORDER BY m.created_at ASC 
      LIMIT 20
    `, [chat.user_id, chat.subject, chat.llm]);
    
    const history = contextResult.rows.map(m => ({
      role: m.sender === 'user' ? 'user' : 'assistant',
      content: m.content
    }));
    
    let response;
    if (chat.llm === 'llama') {
      response = await llamaService.generateChatResponse(history);
    } else {
      response = await openaiService.generateChatResponse(history);
    }
    
    await pool.query(
      'INSERT INTO messages (chat_id, sender, content, model) VALUES ($1, $2, $3, $4)',
      [chat_id, 'assistant', response.content, chat.llm]
    );
    
    res.json({ success: true, aiResponse: response.content });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router; 