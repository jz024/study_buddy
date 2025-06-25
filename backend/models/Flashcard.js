const mongoose = require('mongoose');

const flashcardSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
    trim: true
  },
  answer: {
    type: String,
    required: true,
    trim: true
  },
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  source: {
    note: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Note'
    },
    chatHistory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ChatHistory'
    }
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  tags: [String],
  studyStats: {
    timesReviewed: {
      type: Number,
      default: 0
    },
    correctAnswers: {
      type: Number,
      default: 0
    },
    lastReviewed: Date,
    nextReview: Date,
    easinessFactor: {
      type: Number,
      default: 2.5
    },
    interval: {
      type: Number,
      default: 1
    }
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Flashcard', flashcardSchema); 