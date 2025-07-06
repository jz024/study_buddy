const OpenAI = require('openai');

class MistralService {
  constructor() {
    this.client = null;
    this.initializeClient();
  }

  initializeClient() {
    try {
      const apiKey = process.env.MISTRAL_API_KEY;
      if (!apiKey) {
        console.log('Mistral API key not configured - Mistral service will be disabled');
        return;
      }

      this.client = new OpenAI({
        apiKey: apiKey,
        baseURL: "https://api.mistral.ai/v1",
      });
    } catch (error) {
      console.error('Failed to initialize Mistral client:', error);
    }
  }

  async generateChatResponse(messages, context = '') {
    try {
      if (!this.client) {
        console.log('Mistral client not initialized - returning placeholder response');
        return {
          content: "I'm sorry, but I'm currently in demo mode. The Mistral API key is not configured. Please set up your Mistral API key to enable Mistral functionality.",
          tokensUsed: 0
        };
      }

      const systemMessage = {
        role: 'system',
        content: `You are an AI study buddy helping students learn. ${context ? `Context: ${context}` : ''} Be helpful, encouraging, and educational in your responses.`
      };

      const response = await this.client.chat.completions.create({
        model: "mistral-large-latest",
        messages: [systemMessage, ...messages],
        temperature: 0.7,
        max_tokens: 1000
      });

      return {
        content: response.choices[0].message.content,
        tokensUsed: response.usage.total_tokens
      };
    } catch (error) {
      console.error('Mistral chat error:', error);
      throw new Error('Failed to generate Mistral response');
    }
  }
}

module.exports = new MistralService(); 