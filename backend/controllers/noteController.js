const Note = require('../models/Note');
const Subject = require('../models/Subject');
const fileService = require('../services/fileService');
const openaiService = require('../services/openaiService');

// @desc    Get notes for subject
const getNotes = async (req, res) => {
  try {
    const notes = await Note.find({ 
      subject: req.params.subjectId,
      user: req.user.id 
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      notes
    });
  } catch (error) {
    console.error('Get notes error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create new note
const createNote = async (req, res) => {
  try {
    const { title, content, subjectId, tags } = req.body;

    const note = new Note({
      title,
      content,
      subject: subjectId,
      user: req.user.id,
      tags,
      wordCount: content.split(/\s+/).length
    });

    await note.save();

    // Update subject with new note
    await Subject.findByIdAndUpdate(
      subjectId,
      { $push: { notes: note._id } }
    );

    res.status(201).json({
      success: true,
      message: 'Note created successfully',
      note
    });
  } catch (error) {
    console.error('Create note error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Upload and process document
const uploadNote = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { subjectId } = req.body;
    const { fileInfo, extractedText, wordCount } = await fileService.processUploadedFile(req.file);

    const note = new Note({
      title: fileInfo.originalName,
      content: extractedText,
      subject: subjectId,
      user: req.user.id,
      source: 'upload',
      fileInfo,
      wordCount
    });

    await note.save();

    // Update subject with new note
    await Subject.findByIdAndUpdate(
      subjectId,
      { $push: { notes: note._id } }
    );

    res.status(201).json({
      success: true,
      message: 'File uploaded and processed successfully',
      note
    });
  } catch (error) {
    console.error('Upload note error:', error);
    res.status(500).json({ message: 'Failed to process uploaded file' });
  }
};

// @desc    Update note
const updateNote = async (req, res) => {
  try {
    const { title, content, tags } = req.body;

    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { 
        title, 
        content, 
        tags,
        wordCount: content ? content.split(/\s+/).length : undefined
      },
      { new: true, runValidators: true }
    );

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    res.json({
      success: true,
      message: 'Note updated successfully',
      note
    });
  } catch (error) {
    console.error('Update note error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete note
const deleteNote = async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    // Remove note from subject
    await Subject.findByIdAndUpdate(
      note.subject,
      { $pull: { notes: req.params.id } }
    );

    res.json({
      success: true,
      message: 'Note deleted successfully'
    });
  } catch (error) {
    console.error('Delete note error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getNotes,
  createNote,
  uploadNote,
  updateNote,
  deleteNote
}; 