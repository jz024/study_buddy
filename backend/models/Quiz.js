const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['multiple-choice', 'true-false', 'short-answer'],
    required: true
  },
  options: [String], // For multiple choice questions
  correctAnswer: {
    type: String,
    required: true
  },
  explanation: String,
  points: {
    type: Number,
    default: 1
  }
});

const quizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: String,
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
  questions: [questionSchema],
  settings: {
    timeLimit: Number, // in minutes
    shuffleQuestions: {
      type: Boolean,
      default: false
    },
    shuffleOptions: {
      type: Boolean,
      default: false
    },
    showCorrectAnswers: {
      type: Boolean,
      default: true
    },
    allowRetake: {
      type: Boolean,
      default: true
    }
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard', 'mixed'],
    default: 'mixed'
  },
  totalPoints: {
    type: Number,
    default: 0
  },
  attempts: [{
    startTime: Date,
    endTime: Date,
    score: Number,
    totalPoints: Number,
    answers: [{
      questionIndex: Number,
      userAnswer: String,
      isCorrect: Boolean,
      points: Number
    }]
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Calculate total points when questions change
quizSchema.pre('save', function(next) {
  this.totalPoints = this.questions.reduce((total, question) => total + question.points, 0);
  next();
});

module.exports = mongoose.model('Quiz', quizSchema); 