import englishService from './subjects/englishService';
import mathematicsService from './subjects/mathematicsService';

// Simple service mapping
const services = {
  english: englishService,
  mathematics: mathematicsService
};

// Clean function to get subject service
export const getSubjectService = (subjectId) => {
  const service = services[subjectId];
  if (!service) {
    throw new Error(`No service found for subject: ${subjectId}`);
  }
  return service;
};

// Export individual services
export { englishService, mathematicsService };

// Export all available subjects
export const getAvailableSubjects = () => Object.keys(services);

// Check if subject is supported
export const isSubjectSupported = (subjectId) => services.hasOwnProperty(subjectId); 