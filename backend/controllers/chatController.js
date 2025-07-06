const openaiService = require('../services/openaiService');
const llamaService = require('../services/llamaService');
const mistralService = require('../services/mistralService');

const sendMessage = async (req, res) => {
  try {
    const { message, subjectId, model = 'openai' } = req.body;
    if (!message) {
      return res.status(400).json({
        success: false,
        message: 'Message is required'
      });
    }

    const messages = [{ role: 'user', content: message }];
    
    let response;
    if (model === 'llama') {
      response = await llamaService.generateChatResponse(messages);
    } else if (model === 'mistral') {
      response = await mistralService.generateChatResponse(messages);
    } else {
      response = await openaiService.generateChatResponse(messages);
    }

    const result = {
      success: true,
      data: {
        userMessage: message,
        aiResponse: response.content,
        timestamp: new Date().toISOString(),
        subjectId: subjectId || null,
        tokensUsed: response.tokensUsed,
        model: model
      }
    };

    res.json(result);

  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate AI response'
    });
  }
};

module.exports = {
  sendMessage
}; 