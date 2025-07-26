import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';

const mathematicsService = {
  subjectId: 'mathematics',
  name: 'Mathematics',
  description: 'Algebra, Calculus, Geometry',

  getPersonalizedPrompt(surveyData) {
    let personalization = '';
    if (surveyData) {
      personalization = `\n\n[User Profile]\n- Education Level: ${surveyData.educationLevel}\n- Age: ${surveyData.age}\n- Learning Goals: ${surveyData.learningGoals}\n\n[Instructions for AI]\n- Tailor your explanations, vocabulary, and examples to suit a ${surveyData.educationLevel} student, age ${surveyData.age}.\n- Use simple language and concrete examples for younger or less advanced users.\n- For advanced users, provide deeper insights, technical terms, and more complex examples.\n- Always check the user's profile before answering.\n`;
    }
    return personalization + this.systemPrompt;
  },

  systemPrompt: `You are an expert mathematics tutor specializing in algebra, calculus, geometry, \nand advanced mathematical concepts. You excel at breaking down complex mathematical problems \ninto understandable steps, providing clear explanations, and helping students develop problem-solving \nskills. Always show step-by-step solutions and explain the mathematical reasoning behind each step. \nUse mathematical notation when appropriate and ensure accuracy in all calculations.\n\nIMPORTANT: Format your responses using proper markdown:\n- Use **bold** for emphasis and key concepts\n- Use bullet points with * for lists\n- Use numbered lists (1., 2., 3.) for steps\n- Use clear headings with ## for sections\n- Separate paragraphs with line breaks`,

  async askQuestion(question, context = '', surveyData = null, model = 'openai') {
    try {
      const personalizedPrompt = this.getPersonalizedPrompt(surveyData);
      const response = await axios.post('/api/chat', {
        message: question,
        subjectId: this.subjectId,
        context: context || personalizedPrompt,
        model
      });

      if (response.data.success) {
        return response.data.data.aiResponse;
      } else {
        throw new Error(response.data.message || 'Failed to get response from Mathematics AI');
      }
    } catch (error) {
      console.error('Mathematics AI Service Error:', error);
      throw error;
    }
  },

  async generateQuiz(topic, difficulty = 'medium', questionCount = 10, surveyData = null, model = 'openai') {
    try {
      const personalizedPrompt = this.getPersonalizedPrompt(surveyData);
      const prompt = `Generate a ${difficulty} level quiz about ${topic} in mathematics. \nCreate ${questionCount} multiple choice questions with 4 options each. \nInclude the correct answer and a step-by-step solution for each question.\n\nContext: ${personalizedPrompt}\n\nFormat the response as JSON with the following structure:\n{\n  "title": "Quiz Title",\n  "questions": [\n    {\n      "question": "Question text",\n      "options": ["A", "B", "C", "D"],\n      "correctAnswer": "A",\n      "solution": "Step-by-step solution"\n    }\n  ]\n}`;

      const response = await axios.post('/api/chat', {
        message: prompt,
        subjectId: this.subjectId,
        context: personalizedPrompt,
        model
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
        throw new Error(response.data.message || 'Failed to generate Mathematics quiz');
      }
    } catch (error) {
      console.error('Mathematics Quiz Generation Error:', error);
      throw error;
    }
  },

  async generateFlashcards(content, cardCount = 10, surveyData = null, model = 'openai') {
    try {
      const personalizedPrompt = this.getPersonalizedPrompt(surveyData);
      const prompt = `Create ${cardCount} flashcards from the following content about mathematics.\n\nContent: ${content}\n\nContext: ${personalizedPrompt}\n\nFormat the response as JSON with the following structure:\n{\n  "flashcards": [\n    {\n      "front": "Question or concept",\n      "back": "Answer or explanation with steps"\n    }\n  ]\n}`;

      const response = await axios.post('/api/chat', {
        message: prompt,
        subjectId: this.subjectId,
        context: personalizedPrompt,
        model
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
        throw new Error(response.data.message || 'Failed to generate Mathematics flashcards');
      }
    } catch (error) {
      console.error('Mathematics Flashcard Generation Error:', error);
      throw error;
    }
  },

  async analyzeNotes(notes, surveyData = null, model = 'openai') {
    try {
      const personalizedPrompt = this.getPersonalizedPrompt(surveyData);
      const prompt = `Analyze the following mathematics study notes and provide insights, key concepts, and suggestions for improvement.\n\nNotes: ${notes}\n\nContext: ${personalizedPrompt}\n\nProvide a comprehensive analysis including:\n1. Key mathematical concepts identified\n2. Problem-solving strategies\n3. Areas for improvement\n4. Related topics to explore\n5. Practice recommendations`;

      const response = await axios.post('/api/chat', {
        message: prompt,
        subjectId: this.subjectId,
        context: personalizedPrompt,
        model
      });

      if (response.data.success) {
        return response.data.data.aiResponse;
      } else {
        throw new Error(response.data.message || 'Failed to analyze Mathematics notes');
      }
    } catch (error) {
      console.error('Mathematics Notes Analysis Error:', error);
      throw error;
    }
  }
};

export default mathematicsService; 