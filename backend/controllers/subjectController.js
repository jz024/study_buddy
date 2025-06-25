const Subject = require('../models/Subject');
const User = require('../models/User');

// @desc    Get all subjects for user
// @route   GET /api/subjects
// @access  Private
const getSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find({ user: req.user.id })
      .populate('notes')
      .populate('flashcards')
      .populate('quizzes')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      subjects
    });
  } catch (error) {
    console.error('Get subjects error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create new subject
// @route   POST /api/subjects
// @access  Private
const createSubject = async (req, res) => {
  try {
    const { name, description, color, icon } = req.body;

    const subject = new Subject({
      name,
      description,
      color,
      icon,
      user: req.user.id
    });

    await subject.save();

    // Add subject to user's subjects array
    await User.findByIdAndUpdate(
      req.user.id,
      { $push: { subjects: subject._id } }
    );

    res.status(201).json({
      success: true,
      message: 'Subject created successfully',
      subject
    });
  } catch (error) {
    console.error('Create subject error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get specific subject
// @route   GET /api/subjects/:id
// @access  Private
const getSubject = async (req, res) => {
  try {
    const subject = await Subject.findOne({
      _id: req.params.id,
      user: req.user.id
    })
      .populate('notes')
      .populate('flashcards')
      .populate('quizzes')
      .populate('chatHistory');

    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    res.json({
      success: true,
      subject
    });
  } catch (error) {
    console.error('Get subject error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update subject
// @route   PUT /api/subjects/:id
// @access  Private
const updateSubject = async (req, res) => {
  try {
    const { name, description, color, icon } = req.body;

    const subject = await Subject.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { name, description, color, icon },
      { new: true, runValidators: true }
    );

    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    res.json({
      success: true,
      message: 'Subject updated successfully',
      subject
    });
  } catch (error) {
    console.error('Update subject error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete subject
// @route   DELETE /api/subjects/:id
// @access  Private
const deleteSubject = async (req, res) => {
  try {
    const subject = await Subject.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });

    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    // Remove subject from user's subjects array
    await User.findByIdAndUpdate(
      req.user.id,
      { $pull: { subjects: req.params.id } }
    );

    res.json({
      success: true,
      message: 'Subject deleted successfully'
    });
  } catch (error) {
    console.error('Delete subject error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getSubjects,
  createSubject,
  getSubject,
  updateSubject,
  deleteSubject
}; 