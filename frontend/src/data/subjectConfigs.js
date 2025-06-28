// Centralized subject configurations
export const subjectConfigs = {
  english: {
    id: 'english',
    name: 'English',
    icon: '📚',
    color: '#EF4444',
    description: 'Literature, Grammar, Writing',
    context: 'English literature, grammar rules, writing techniques, vocabulary, and literary analysis.',
    sampleQuestions: [
      'Explain the difference between active and passive voice',
      'What are the key themes in Shakespeare\'s Hamlet?',
      'How do I write an effective thesis statement?'
    ],
    topics: ['Grammar', 'Literature', 'Writing', 'Vocabulary'],
    aiSupported: true
  },
  mathematics: {
    id: 'mathematics',
    name: 'Mathematics',
    icon: '🔢',
    color: '#3B82F6',
    description: 'Algebra, Calculus, Geometry',
    context: 'Mathematical concepts, problem-solving strategies, formulas, and mathematical proofs.',
    sampleQuestions: [
      'How do I solve quadratic equations?',
      'Explain the concept of derivatives in calculus',
      'What is the Pythagorean theorem and how is it used?'
    ],
    topics: ['Algebra', 'Calculus', 'Geometry', 'Statistics'],
    aiSupported: true
  },
  biology: {
    id: 'biology',
    name: 'Biology',
    icon: '🧬',
    color: '#10B981',
    description: 'Life Sciences, Ecology',
    context: 'Biological systems, cellular processes, genetics, ecology, and human anatomy.',
    sampleQuestions: [
      'How does photosynthesis work?',
      'Explain the process of mitosis',
      'What is the role of DNA in inheritance?'
    ],
    topics: ['Cell Biology', 'Genetics', 'Ecology', 'Anatomy'],
    aiSupported: false // TODO: Implement BiologyAIService
  },
  'computer-science': {
    id: 'computer-science',
    name: 'Computer Science',
    icon: '💻',
    color: '#8B5CF6',
    description: 'Programming, Algorithms',
    context: 'Programming languages, algorithms, data structures, software development, and computer systems.',
    sampleQuestions: [
      'How do I implement a binary search algorithm?',
      'Explain object-oriented programming concepts',
      'What is the difference between arrays and linked lists?'
    ],
    topics: ['Programming', 'Algorithms', 'Data Structures', 'Web Development'],
    aiSupported: false // TODO: Implement ComputerScienceAIService
  },
  chemistry: {
    id: 'chemistry',
    name: 'Chemistry',
    icon: '⚗️',
    color: '#F59E0B',
    description: 'Organic, Inorganic, Physical',
    context: 'Chemical reactions, molecular structures, periodic table, and chemical bonding.',
    sampleQuestions: [
      'How do I balance chemical equations?',
      'Explain the concept of pH and acidity',
      'What is the difference between ionic and covalent bonds?'
    ],
    topics: ['Organic Chemistry', 'Inorganic Chemistry', 'Physical Chemistry', 'Biochemistry'],
    aiSupported: false // TODO: Implement ChemistryAIService
  },
  physics: {
    id: 'physics',
    name: 'Physics',
    icon: '⚡',
    color: '#EC4899',
    description: 'Mechanics, Thermodynamics',
    context: 'Physical laws, mechanics, thermodynamics, electromagnetism, and quantum physics.',
    sampleQuestions: [
      'How do I calculate force using Newton\'s second law?',
      'Explain the concept of energy conservation',
      'What is the relationship between voltage, current, and resistance?'
    ],
    topics: ['Mechanics', 'Thermodynamics', 'Electromagnetism', 'Quantum Physics'],
    aiSupported: false // TODO: Implement PhysicsAIService
  },
  history: {
    id: 'history',
    name: 'History',
    icon: '📜',
    color: '#DC2626',
    description: 'World History, Civilizations',
    context: 'Historical events, civilizations, political movements, and cultural developments.',
    sampleQuestions: [
      'What were the causes of World War I?',
      'Explain the impact of the Industrial Revolution',
      'How did ancient Rome influence modern society?'
    ],
    topics: ['World History', 'Ancient Civilizations', 'Modern History', 'Political History'],
    aiSupported: false // TODO: Implement HistoryAIService
  },
  psychology: {
    id: 'psychology',
    name: 'Psychology',
    icon: '🧠',
    color: '#7C3AED',
    description: 'Behavioral Science, Mental Health',
    context: 'Human behavior, cognitive processes, mental health, and psychological theories.',
    sampleQuestions: [
      'What is classical conditioning?',
      'Explain the stages of cognitive development',
      'How do memory processes work?'
    ],
    topics: ['Cognitive Psychology', 'Behavioral Psychology', 'Clinical Psychology', 'Social Psychology'],
    aiSupported: false // TODO: Implement PsychologyAIService
  },
  business: {
    id: 'business',
    name: 'Business',
    icon: '💼',
    color: '#059669',
    description: 'Management, Economics',
    context: 'Business management, economics, marketing strategies, and financial concepts.',
    sampleQuestions: [
      'What is the difference between fixed and variable costs?',
      'Explain the concept of supply and demand',
      'How do I create a business plan?'
    ],
    topics: ['Management', 'Economics', 'Marketing', 'Finance'],
    aiSupported: false // TODO: Implement BusinessAIService
  },
  geography: {
    id: 'geography',
    name: 'Geography',
    icon: '🌍',
    color: '#0891B2',
    description: 'Physical, Human Geography',
    context: 'Physical geography, human geography, environmental science, and cartography.',
    sampleQuestions: [
      'What causes climate change?',
      'Explain the water cycle process',
      'How do tectonic plates move?'
    ],
    topics: ['Physical Geography', 'Human Geography', 'Cartography', 'Environmental Science'],
    aiSupported: false // TODO: Implement GeographyAIService
  },
  literature: {
    id: 'literature',
    name: 'Literature',
    icon: '📖',
    color: '#B45309',
    description: 'Classic and Modern Literature',
    context: 'Literary analysis, classic and modern literature, poetry, and dramatic works.',
    sampleQuestions: [
      'How do I analyze a poem?',
      'What are the characteristics of Gothic literature?',
      'Explain the concept of symbolism in literature'
    ],
    topics: ['Classic Literature', 'Modern Literature', 'Poetry', 'Drama'],
    aiSupported: false // TODO: Implement LiteratureAIService
  },
  art: {
    id: 'art',
    name: 'Art',
    icon: '🎨',
    color: '#BE185D',
    description: 'Visual Arts, Design',
    context: 'Art history, visual arts, design principles, and artistic techniques.',
    sampleQuestions: [
      'What are the principles of design?',
      'Explain the difference between impressionism and expressionism',
      'How do I create depth in a painting?'
    ],
    topics: ['Drawing', 'Painting', 'Sculpture', 'Digital Art'],
    aiSupported: false // TODO: Implement ArtAIService
  }
};

// Helper functions
export const getSubjectConfig = (subjectId) => {
  return subjectConfigs[subjectId] || null;
};

export const getAllSubjects = () => {
  return Object.values(subjectConfigs);
};

export const getAISupportedSubjects = () => {
  return Object.values(subjectConfigs).filter(subject => subject.aiSupported);
};

export const isSubjectAISupported = (subjectId) => {
  const config = getSubjectConfig(subjectId);
  return config ? config.aiSupported : false;
}; 