const openai = require('../config/openai');

class OpenAIService {
  async generateChatResponse(messages, context = '') {
    try {
      const systemMessage = {
        role: 'system',
        content: `You are an AI study buddy helping students learn. ${context ? `Context: ${context}` : ''} Be helpful, encouraging, and educational in your responses.`
      };

      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [systemMessage, ...messages],
        max_tokens: 1000,
        temperature: 0.7
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

  async generateFlashcards(content, count = 5) {
    try {
      const prompt = `Based on the following content, generate ${count} flashcard questions and answers. Return them in JSON format as an array of objects with 'question' and 'answer' properties.

Content: ${content}

Format:
[
  {"question": "Question 1", "answer": "Answer 1"},
  {"question": "Question 2", "answer": "Answer 2"}
]`;

      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1500,
        temperature: 0.3
      });

      const flashcardsText = response.choices[0].message.content;
      return JSON.parse(flashcardsText);
    } catch (error) {
      console.error('OpenAI flashcard generation error:', error);
      throw new Error('Failed to generate flashcards');
    }
  }

  async generateQuiz(content, questionCount = 5, difficulty = 'medium') {
    try {
      const prompt = `Based on the following content, generate a ${difficulty} difficulty quiz with ${questionCount} questions. Include multiple choice, true/false, and short answer questions. Return in JSON format.

Content: ${content}

Format:
{
  "title": "Quiz Title",
  "questions": [
    {
      "question": "Question text",
      "type": "multiple-choice",
      "options": ["A", "B", "C", "D"],
      "correctAnswer": "A",
      "explanation": "Why this is correct"
    }
  ]
}`;

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

  async generateEmbedding(text) {
    try {
      const response = await openai.embeddings.create({
        model: 'text-embedding-ada-002',
        input: text
      });

      return response.data[0].embedding;
    } catch (error) {
      console.error('OpenAI embedding error:', error);
      throw new Error('Failed to generate embedding');
    }
  }

  async summarizeText(text, maxLength = 200) {
    try {
      const prompt = `Summarize the following text in ${maxLength} words or less:\n\n${text}`;

      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: Math.ceil(maxLength * 1.5),
        temperature: 0.3
      });

      return response.choices[0].message.content;
    } catch (error) {
      console.error('OpenAI summarization error:', error);
      throw new Error('Failed to summarize text');
    }
  }
}

module.exports = new OpenAIService(); 