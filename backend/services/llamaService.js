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
        let systemContent = `You are an AI study buddy helping students learn.`;
        if (context) {
          systemContent += `\n\n${context}\n\n[Instructions for AI]\n- Tailor your explanations, vocabulary, and examples to suit the user's education level and age as described above.\n- Use simple language and concrete examples for younger or less advanced users.\n- For advanced users, provide deeper insights, technical terms, and more complex examples.\n- Always check the user's profile before answering.`;
        }
        systemContent += ' Be helpful, encouraging, and educational in your responses. Always maintain context from previous messages.';
        const systemMessage = {
          role: 'system',
          content: systemContent
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

  async generateQuiz(content, questionCount = 5, difficulty = 'medium') {
    try {
      if (!this.client) {
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

      const response = await this.client.chat.completions.create({
        model: "Meta-Llama-3.3-70B-Instruct",
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
        top_p: 0.1,
        max_tokens: 2000
      });

      let quizText = response.choices[0].message.content.trim();
      if (quizText.startsWith('```')) {
        quizText = quizText.replace(/^```[a-zA-Z]*\n?/, '');
        if (quizText.endsWith('```')) {
          quizText = quizText.slice(0, -3);
        }
        quizText = quizText.trim();
      }
      try {
        return JSON.parse(quizText);
      } catch (parseError) {
        console.error('Llama quiz generation returned invalid JSON. Raw response:', quizText);
        throw new Error('Llama quiz generation failed: invalid JSON returned by model.');
      }
    } catch (error) {
      console.error('Llama quiz generation error:', error);
      throw new Error('Failed to generate quiz');
    }
  }
}

module.exports = new LlamaService(); 