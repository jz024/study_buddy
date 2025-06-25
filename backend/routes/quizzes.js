const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');
const auth = require('../middleware/auth');
const { validateObjectId } = require('../middleware/validation');

// All routes are protected
router.use(auth);

// POST /api/quizzes/generate - Generate quiz
router.post('/generate', quizController.generateQuiz);

// GET /api/quizzes/:subjectId - Get quizzes for subject
router.get('/:subjectId', validateObjectId, quizController.getQuizzes);

// GET /api/quizzes/quiz/:id - Get specific quiz
router.get('/quiz/:id', validateObjectId, quizController.getQuiz);

// POST /api/quizzes/:id/attempt - Submit quiz attempt
router.post('/:id/attempt', validateObjectId, quizController.submitQuizAttempt);

// DELETE /api/quizzes/:id - Delete quiz
router.delete('/:id', validateObjectId, quizController.deleteQuiz);

module.exports = router; 