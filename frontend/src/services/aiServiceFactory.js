import EnglishAIService from './subjects/englishAIService';
import MathematicsAIService from './subjects/mathematicsAIService';

// Factory class to manage subject-specific AI services
class AIServiceFactory {
  constructor() {
    this.services = new Map();
    this.initializeServices();
  }

  initializeServices() {
    // Register all subject-specific AI services
    this.services.set('english', EnglishAIService);
    this.services.set('mathematics', MathematicsAIService);
    
    // TODO: Add more subject services as they are created
    // this.services.set('biology', BiologyAIService);
    // this.services.set('computer-science', ComputerScienceAIService);
    // this.services.set('chemistry', ChemistryAIService);
    // this.services.set('physics', PhysicsAIService);
    // this.services.set('history', HistoryAIService);
    // this.services.set('psychology', PsychologyAIService);
    // this.services.set('business', BusinessAIService);
    // this.services.set('geography', GeographyAIService);
    // this.services.set('literature', LiteratureAIService);
    // this.services.set('art', ArtAIService);
  }

  getService(subjectId) {
    const ServiceClass = this.services.get(subjectId);
    
    if (!ServiceClass) {
      throw new Error(`No AI service found for subject: ${subjectId}`);
    }

    // Return a new instance of the service
    return new ServiceClass();
  }

  getAvailableSubjects() {
    return Array.from(this.services.keys());
  }

  isSubjectSupported(subjectId) {
    return this.services.has(subjectId);
  }
}

// Create a singleton instance
const aiServiceFactory = new AIServiceFactory();

export default aiServiceFactory; 