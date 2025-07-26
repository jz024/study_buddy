const openai = require('../config/openai');

class OpenAIService {
  async generateChatResponse(messages, context = '') {
    try {
      if (!openai) {
        return {
          content: "I'm sorry, but I'm currently in demo mode. The OpenAI API key is not configured. Please set up your OpenAI API key to enable full AI functionality.",
          tokensUsed: 0
        };
      }

      const hasSystemMessage = messages.length > 0 && messages[0].role === 'system';
      
      let finalMessages = messages;
      if (!hasSystemMessage) {
        const systemMessage = {
          role: 'system',
          content: `You are an AI study buddy helping students learn. ${context ? `Context: ${context}` : ''} Be helpful, encouraging, and educational in your responses. Always maintain context from previous messages.`
        };
        finalMessages = [systemMessage, ...messages];
      }

      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: finalMessages,
        max_tokens: 1000,
        temperature: 0.7,
      });

      return {
        content: response.choices[0].message.content,
        tokensUsed: response.usage.total_tokens
      };
    } catch (error) {
      console.error('OpenAI chat error:', error);
      throw new Error('Failed to generate AI response');
    }
  }

  async generateQuiz(content, questionCount = 5, difficulty = 'medium') {
    try {
      if (!openai) {
        console.log('OpenAI client not initialized - returning placeholder quiz');
        return {
          title: "Sample Quiz",
          questions: [
            {
              question: "This is a sample question?",
              type: "multiple-choice",
              options: ["A", "B", "C", "D"],
              correctAnswer: "A",
              explanation: "This is a sample explanation"
            }
          ]
        };
      }

      const prompt = content;

      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 2000,
        temperature: 0.3
      });

      const quizText = response.choices[0].message.content;
      return JSON.parse(quizText);
    } catch (error) {
      console.error('OpenAI quiz generation error:', error);
      throw new Error('Failed to generate quiz');
    }
  }
}

module.exports = new OpenAIService(); 