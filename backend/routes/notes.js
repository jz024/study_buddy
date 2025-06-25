const express = require('express');
const router = express.Router();
const noteController = require('../controllers/noteController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const { validateNote, validateObjectId } = require('../middleware/validation');

// All routes are protected
router.use(auth);

// GET /api/notes/:subjectId - Get notes for subject
router.get('/:subjectId', validateObjectId, noteController.getNotes);

// POST /api/notes - Create new note
router.post('/', validateNote, noteController.createNote);

// POST /api/notes/upload - Upload and process document
router.post('/upload', upload.single('file'), noteController.uploadNote);

// PUT /api/notes/:id - Update note
router.put('/:id', validateObjectId, noteController.updateNote);

// DELETE /api/notes/:id - Delete note
router.delete('/:id', validateObjectId, noteController.deleteNote);

module.exports = router; 