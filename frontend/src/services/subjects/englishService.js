import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';

const englishService = {
  subjectId: 'english',
  name: 'English',
  description: 'Literature, Grammar, Writing',

  getPersonalizedPrompt(surveyData) {
    let personalization = '';
    if (surveyData) {
      personalization = `\n\n[User Profile]\n- Education Level: ${surveyData.educationLevel}\n- Age: ${surveyData.age}\n- Learning Goals: ${surveyData.learningGoals}\n`;
    }
    return personalization + this.systemPrompt;
  },

  systemPrompt: `You are an expert English tutor specializing in literature, grammar, and writing. \nYou have deep knowledge of English literature from classical to modern works, grammar rules, \nwriting techniques, and literary analysis. Provide clear, educational responses that help students \nunderstand complex concepts in English studies. Always include examples and explanations that \nenhance learning.\n\nIMPORTANT: Format your responses using proper markdown:\n- Use **bold** for emphasis and key concepts\n- Use bullet points with * for lists\n- Use numbered lists (1., 2., 3.) for steps\n- Use clear headings with ## for sections\n- Separate paragraphs with line breaks`,

  async askQuestion(question, context = '', surveyData = null) {
    try {
      const personalizedPrompt = this.getPersonalizedPrompt(surveyData);
      const response = await axios.post('/api/chat', {
        message: question,
        subjectId: this.subjectId,
        context: context || personalizedPrompt
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
  },

  async generateQuiz(topic, difficulty = 'medium', questionCount = 10, surveyData = null) {
    try {
      const personalizedPrompt = this.getPersonalizedPrompt(surveyData);
      const prompt = `Generate a ${difficulty} level quiz about ${topic} in English studies. \nCreate ${questionCount} multiple choice questions with 4 options each. \nInclude the correct answer and a brief explanation for each question.\n\nContext: ${personalizedPrompt}\n\nFormat the response as JSON with the following structure:\n{\n  "title": "Quiz Title",\n  "questions": [\n    {\n      "question": "Question text",\n      "options": ["A", "B", "C", "D"],\n      "correctAnswer": "A",\n      "explanation": "Brief explanation"\n    }\n  ]\n}`;

      const response = await axios.post('/api/chat', {
        message: prompt,
        subjectId: this.subjectId,
        context: personalizedPrompt
      });

      if (response.data.success) {
        try {
          const quizData = JSON.parse(response.data.data.aiResponse);
          return quizData;
        } catch (parseError) {
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
  },

  async generateFlashcards(content, cardCount = 10, surveyData = null) {
    try {
      const personalizedPrompt = this.getPersonalizedPrompt(surveyData);
      const prompt = `Create ${cardCount} flashcards from the following content about English studies.\n\nContent: ${content}\n\nContext: ${personalizedPrompt}\n\nFormat the response as JSON with the following structure:\n{\n  "flashcards": [\n    {\n      "front": "Question or concept",\n      "back": "Answer or explanation"\n    }\n  ]\n}`;

      const response = await axios.post('/api/chat', {
        message: prompt,
        subjectId: this.subjectId,
        context: personalizedPrompt
      });

      if (response.data.success) {
        try {
          const flashcardData = JSON.parse(response.data.data.aiResponse);
          return flashcardData.flashcards || flashcardData;
        } catch (parseError) {
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
  },

  async analyzeNotes(notes, surveyData = null) {
    try {
      const personalizedPrompt = this.getPersonalizedPrompt(surveyData);
      const prompt = `Analyze the following English study notes and provide insights, key concepts, and suggestions for improvement.\n\nNotes: ${notes}\n\nContext: ${personalizedPrompt}\n\nProvide a comprehensive analysis including:\n1. Key concepts identified\n2. Areas for improvement\n3. Related topics to explore\n4. Study recommendations`;

      const response = await axios.post('/api/chat', {
        message: prompt,
        subjectId: this.subjectId,
        context: personalizedPrompt
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
};

export default englishService; 