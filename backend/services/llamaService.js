const OpenAI = require('openai');

class LlamaService {
  constructor() {
    this.client = null;
    this.initializeClient();
  }

  initializeClient() {
    try {
      const apiKey = process.env.SAMBANOVA_API_KEY;
      if (!apiKey) {
        console.log('SambaNova API key not configured - Llama service will be disabled');
        return;
      }

      this.client = new OpenAI({
        apiKey: apiKey,
        baseURL: "https://api.sambanova.ai/v1",
      });
    } catch (error) {
      console.error('Failed to initialize Llama client:', error);
    }
  }

  async generateChatResponse(messages, context = '') {
    try {
      if (!this.client) {
        console.log('Llama client not initialized - returning placeholder response');
        return {
          content: "I'm sorry, but I'm currently in demo mode. The SambaNova API key is not configured. Please set up your SambaNova API key to enable Llama functionality.",
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

      const response = await this.client.chat.completions.create({
        model: "Meta-Llama-3.3-70B-Instruct",
        messages: finalMessages,
        temperature: 0.7,
        top_p: 0.1,
        max_tokens: 1000
      });

      return {
        content: response.choices[0].message.content,
        tokensUsed: response.usage.total_tokens
      };
    } catch (error) {
      console.error('Llama chat error:', error);
      throw new Error('Failed to generate Llama response');
    }
  }
}

module.exports = new LlamaService(); 