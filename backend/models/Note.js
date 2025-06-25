const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
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
    type: String,
    enum: ['manual', 'upload', 'generated'],
    default: 'manual'
  },
  fileInfo: {
    originalName: String,
    fileName: String,
    filePath: String,
    fileSize: Number,
    mimeType: String
  },
  tags: [String],
  embedding: [Number], // For AI similarity search
  wordCount: {
    type: Number,
    default: 0
  },
  isBookmarked: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Create text index for search
noteSchema.index({ title: 'text', content: 'text', tags: 'text' });

module.exports = mongoose.model('Note', noteSchema); 