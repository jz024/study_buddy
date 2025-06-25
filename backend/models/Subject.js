const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  color: {
    type: String,
    default: '#1976d2'
  },
  icon: {
    type: String,
    default: '📚'
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isDefault: {
    type: Boolean,
    default: false
  },
  notes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Note'
  }],
  flashcards: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Flashcard'
  }],
  quizzes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz'
  }],
  chatHistory: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ChatHistory'
  }],
  stats: {
    totalNotes: {
      type: Number,
      default: 0
    },
    totalFlashcards: {
      type: Number,
      default: 0
    },
    totalQuizzes: {
      type: Number,
      default: 0
    },
    studyTime: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Subject', subjectSchema); 