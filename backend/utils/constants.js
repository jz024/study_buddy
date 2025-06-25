// Application Constants

const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500
};

const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin'
};

const SUBJECT_DEFAULTS = [
  {
    name: 'Mathematics',
    description: 'Mathematical concepts and problem solving',
    color: '#2196F3',
    icon: '🔢',
    isDefault: true
  },
  {
    name: 'Biology',
    description: 'Life sciences and biological processes',
    color: '#4CAF50',
    icon: '🧬',
    isDefault: true
  },
  {
    name: 'History',
    description: 'Historical events and timelines',
    color: '#FF9800',
    icon: '📚',
    isDefault: true
  }
];

const OPENAI_MODELS = {
  CHAT: 'gpt-3.5-turbo',
  EMBEDDING: 'text-embedding-ada-002'
};

const FILE_TYPES = {
  PDF: 'application/pdf',
  DOCX: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
};

module.exports = {
  HTTP_STATUS,
  USER_ROLES,
  SUBJECT_DEFAULTS,
  OPENAI_MODELS,
  FILE_TYPES
}; 