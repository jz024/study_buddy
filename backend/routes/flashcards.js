const express = require('express');
const router = express.Router();
const flashcardController = require('../controllers/flashcardController');
const auth = require('../middleware/auth');
const { validateObjectId } = require('../middleware/validation');

// All routes are protected
router.use(auth);

// POST /api/flashcards/generate - Generate flashcards
router.post('/generate', flashcardController.generateFlashcards);

// GET /api/flashcards/:subjectId - Get flashcards for subject
router.get('/:subjectId', validateObjectId, flashcardController.getFlashcards);

// PUT /api/flashcards/:id - Update flashcard
router.put('/:id', validateObjectId, flashcardController.updateFlashcard);

// DELETE /api/flashcards/:id - Delete flashcard
router.delete('/:id', validateObjectId, flashcardController.deleteFlashcard);

// POST /api/flashcards/:id/review - Record flashcard review
router.post('/:id/review', validateObjectId, flashcardController.reviewFlashcard);

module.exports = router; 