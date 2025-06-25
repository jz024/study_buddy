const express = require('express');
const router = express.Router();
const subjectController = require('../controllers/subjectController');
const auth = require('../middleware/auth');
const { validateSubject, validateObjectId } = require('../middleware/validation');

// All routes are protected
router.use(auth);

// GET /api/subjects - Get all subjects for user
router.get('/', subjectController.getSubjects);

// POST /api/subjects - Create new subject
router.post('/', validateSubject, subjectController.createSubject);

// GET /api/subjects/:id - Get specific subject
router.get('/:id', validateObjectId, subjectController.getSubject);

// PUT /api/subjects/:id - Update subject
router.put('/:id', validateObjectId, subjectController.updateSubject);

// DELETE /api/subjects/:id - Delete subject
router.delete('/:id', validateObjectId, subjectController.deleteSubject);

module.exports = router; 