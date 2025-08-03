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
        temperature: 0.6,
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

  async generateFlashcards(content, cardCount = 10, difficulty = 'medium') {
    try {
      if (!this.client) {
        return {
          title: "Sample Flashcards",
          cards: [
            {
              question: "What is a sample question?",
              answer: "This is a sample answer with explanation.",
              category: "Sample Category"
            }
          ]
        };
      }

      const prompt = content;

      const response = await this.client.chat.completions.create({
        model: "Meta-Llama-3.3-70B-Instruct",
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.6,
        top_p: 0.1,
        max_tokens: 2000
      });

      let flashcardText = response.choices[0].message.content.trim();
      if (flashcardText.startsWith('```')) {
        flashcardText = flashcardText.replace(/^```[a-zA-Z]*\n?/, '');
        if (flashcardText.endsWith('```')) {
          flashcardText = flashcardText.slice(0, -3);
        }
        flashcardText = flashcardText.trim();
      }
      try {
        const parsedData = JSON.parse(flashcardText);
        
        if (parsedData.cards && Array.isArray(parsedData.cards)) {
          if (parsedData.cards.length < cardCount) {
            console.log(`Generated ${parsedData.cards.length} cards, need ${cardCount}. Adding placeholder cards.`);
            const placeholderCards = [];
            for (let i = parsedData.cards.length; i < cardCount; i++) {
              placeholderCards.push({
                question: `Additional question ${i + 1} about the topic?`,
                answer: `This is an additional answer to help you study the material more thoroughly.`,
                category: 'Additional'
              });
            }
            parsedData.cards = [...parsedData.cards, ...placeholderCards];
          } else if (parsedData.cards.length > cardCount) {
            console.log(`Generated ${parsedData.cards.length} cards, need ${cardCount}. Truncating to ${cardCount}.`);
            parsedData.cards = parsedData.cards.slice(0, cardCount);
          }
        }
        
        return parsedData;
      } catch (parseError) {
        console.error('Llama flashcard generation returned invalid JSON. Raw response:', flashcardText);
        throw new Error('Llama flashcard generation failed: invalid JSON returned by model.');
      }
    } catch (error) {
      console.error('Llama flashcard generation error:', error);
      throw new Error('Failed to generate flashcards');
    }
  }
}

module.exports = new LlamaService(); 