import axios from 'axios';

const mathematicsService = {
  subjectId: 'mathematics',
  name: 'Mathematics',
  description: 'Algebra, Calculus, Geometry',
  
  systemPrompt: `You are an expert mathematics tutor specializing in algebra, calculus, geometry, 
  and advanced mathematical concepts. You excel at breaking down complex mathematical problems 
  into understandable steps, providing clear explanations, and helping students develop problem-solving 
  skills. Always show step-by-step solutions and explain the mathematical reasoning behind each step. 
  Use mathematical notation when appropriate and ensure accuracy in all calculations.
  
  IMPORTANT: Format your responses using proper markdown:
  - Use **bold** for emphasis and key concepts
  - Use bullet points with * for lists
  - Use numbered lists (1., 2., 3.) for steps
  - Use clear headings with ## for sections
  - Separate paragraphs with line breaks`,

  async askQuestion(question, context = '') {
    try {
      const response = await axios.post('/api/chat', {
        message: question,
        subjectId: this.subjectId,
        context: context || this.systemPrompt
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

  async generateQuiz(topic, difficulty = 'medium', questionCount = 10) {
    try {
      const prompt = `Generate a ${difficulty} level quiz about ${topic} in mathematics. 
      Create ${questionCount} multiple choice questions with 4 options each. 
      Include the correct answer and a step-by-step solution for each question.
      
      Context: ${this.systemPrompt}
      
      Format the response as JSON with the following structure:
      {
        "title": "Quiz Title",
        "questions": [
          {
            "question": "Question text",
            "options": ["A", "B", "C", "D"],
            "correctAnswer": "A",
            "solution": "Step-by-step solution"
          }
        ]
      }`;

      const response = await axios.post('/api/chat', {
        message: prompt,
        subjectId: this.subjectId,
        context: this.systemPrompt
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

  async generateFlashcards(content, cardCount = 10) {
    try {
      const prompt = `Create ${cardCount} flashcards from the following content about mathematics.
      
      Content: ${content}
      
      Context: ${this.systemPrompt}
      
      Format the response as JSON with the following structure:
      {
        "flashcards": [
          {
            "front": "Question or concept",
            "back": "Answer or explanation with steps"
          }
        ]
      }`;

      const response = await axios.post('/api/chat', {
        message: prompt,
        subjectId: this.subjectId,
        context: this.systemPrompt
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

  async analyzeNotes(notes) {
    try {
      const prompt = `Analyze the following mathematics study notes and provide insights, key concepts, and suggestions for improvement.
      
      Notes: ${notes}
      
      Context: ${this.systemPrompt}
      
      Provide a comprehensive analysis including:
      1. Key mathematical concepts identified
      2. Problem-solving strategies
      3. Areas for improvement
      4. Related topics to explore
      5. Practice recommendations`;

      const response = await axios.post('/api/chat', {
        message: prompt,
        subjectId: this.subjectId,
        context: this.systemPrompt
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