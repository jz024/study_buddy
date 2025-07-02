import BaseAIService from '../aiService';
import axios from 'axios';

class EnglishAIService extends BaseAIService {
  constructor() {
    super('english');
    this.subjectContext = {
      name: 'English',
      description: 'Literature, Grammar, Writing',
      expertise: [
        'English literature analysis',
        'Grammar rules and usage',
        'Writing techniques and styles',
        'Essay writing and composition',
        'Poetry analysis',
        'Creative writing',
        'Academic writing'
      ],
      systemPrompt: `You are an expert English tutor specializing in literature, grammar, and writing. 
      You have deep knowledge of English literature from classical to modern works, grammar rules, 
      writing techniques, and literary analysis. Provide clear, educational responses that help students 
      understand complex concepts in English studies. Always include examples and explanations that 
      enhance learning.`
    };
  }

  async askQuestion(question, context = '') {
    try {
      const response = await axios.post(`${this.baseUrl}/api/chat`, {
        message: question,
        subjectId: 'english',
        context: context || this.subjectContext.systemPrompt
      });

      if (response.data.success) {
        return response.data.data.aiResponse;
      } else {
        throw new Error(response.data.message || 'Failed to get response from English AI');
      }
    } catch (error) {
      console.error('English AI Service Error:', error);
      throw error;
    }
  }

  async generateQuiz(topic, difficulty = 'medium', questionCount = 10) {
    try {
      const prompt = `Generate a ${difficulty} level quiz about ${topic} in English studies. 
      Create ${questionCount} multiple choice questions with 4 options each. 
      Include the correct answer and a brief explanation for each question.
      
      Context: ${this.subjectContext.systemPrompt}
      
      Format the response as JSON with the following structure:
      {
        "title": "Quiz Title",
        "questions": [
          {
            "question": "Question text",
            "options": ["A", "B", "C", "D"],
            "correctAnswer": "A",
            "explanation": "Brief explanation"
          }
        ]
      }`;

      const response = await axios.post(`${this.baseUrl}/api/chat`, {
        message: prompt,
        subjectId: 'english',
        context: this.subjectContext.systemPrompt
      });

      if (response.data.success) {
        try {
          // Try to parse the response as JSON
          const quizData = JSON.parse(response.data.data.aiResponse);
          return quizData;
        } catch (parseError) {
          // If parsing fails, return a structured response
          return {
            title: `${topic} Quiz`,
            questions: [],
            rawResponse: response.data.data.aiResponse
          };
        }
      } else {
        throw new Error(response.data.message || 'Failed to generate English quiz');
      }
    } catch (error) {
      console.error('English Quiz Generation Error:', error);
      throw error;
    }
  }

  async generateFlashcards(content, cardCount = 10) {
    try {
      const prompt = `Create ${cardCount} flashcards from the following content about English studies.
      
      Content: ${content}
      
      Context: ${this.subjectContext.systemPrompt}
      
      Format the response as JSON with the following structure:
      {
        "flashcards": [
          {
            "front": "Question or concept",
            "back": "Answer or explanation"
          }
        ]
      }`;

      const response = await axios.post(`${this.baseUrl}/api/chat`, {
        message: prompt,
        subjectId: 'english',
        context: this.subjectContext.systemPrompt
      });

      if (response.data.success) {
        try {
          // Try to parse the response as JSON
          const flashcardData = JSON.parse(response.data.data.aiResponse);
          return flashcardData.flashcards || flashcardData;
        } catch (parseError) {
          // If parsing fails, return a structured response
          return [{
            front: "Sample Question",
            back: response.data.data.aiResponse
          }];
        }
      } else {
        throw new Error(response.data.message || 'Failed to generate English flashcards');
      }
    } catch (error) {
      console.error('English Flashcard Generation Error:', error);
      throw error;
    }
  }

  async analyzeNotes(notes) {
    try {
      const prompt = `Analyze the following English study notes and provide insights, key concepts, and suggestions for improvement.
      
      Notes: ${notes}
      
      Context: ${this.subjectContext.systemPrompt}
      
      Provide a comprehensive analysis including:
      1. Key concepts identified
      2. Areas for improvement
      3. Related topics to explore
      4. Study recommendations`;

      const response = await axios.post(`${this.baseUrl}/api/chat`, {
        message: prompt,
        subjectId: 'english',
        context: this.subjectContext.systemPrompt
      });

      if (response.data.success) {
        return response.data.data.aiResponse;
      } else {
        throw new Error(response.data.message || 'Failed to analyze English notes');
      }
    } catch (error) {
      console.error('English Notes Analysis Error:', error);
      throw error;
    }
  }
}

export default EnglishAIService; 