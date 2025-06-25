// Simple Chat Controller - Placeholder implementation

const openaiService = require('../services/openaiService');

const sendMessage = async (req, res) => {
  try {
    const { message, subjectId } = req.body;
    
    if (!message) {
      return res.status(400).json({
        success: false,
        message: 'Message is required'
      });
    }

    // Use OpenAI service to generate response
    const messages = [{ role: 'user', content: message }];
    const response = await openaiService.generateChatResponse(messages);

    const result = {
      success: true,
      data: {
        userMessage: message,
        aiResponse: response.content,
        timestamp: new Date().toISOString(),
        subjectId: subjectId || null,
        tokensUsed: response.tokensUsed
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