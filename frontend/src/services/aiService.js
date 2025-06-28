// Base AI Service - Abstract class for subject-specific AI implementations
class BaseAIService {
  constructor(subjectId) {
    this.subjectId = subjectId;
    this.baseUrl = ''; // Use relative URLs since proxy is configured
  }

  async askQuestion(question, context = '') {
    throw new Error('askQuestion must be implemented by subject-specific service');
  }

  async generateQuiz(topic, difficulty = 'medium', questionCount = 10) {
    throw new Error('generateQuiz must be implemented by subject-specific service');
  }

  async generateFlashcards(content, cardCount = 10) {
    throw new Error('generateFlashcards must be implemented by subject-specific service');
  }

  async analyzeNotes(notes) {
    throw new Error('analyzeNotes must be implemented by subject-specific service');
  }
}

export default BaseAIService; 