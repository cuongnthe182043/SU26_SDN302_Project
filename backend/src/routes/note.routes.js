const express = require('express');
const { body } = require('express-validator');
const { validateRequest } = require('../middleware/validation.middleware');
const { listNotes, createNote, updateNote, deleteNote } = require('../controllers/note.controller');

const router = express.Router({ mergeParams: true });

router.get('/', listNotes);
router.post('/', [body('body').trim().notEmpty().withMessage('Note body is required')], validateRequest, createNote);
router.put('/:noteId', [body('body').optional().trim().notEmpty().withMessage('Note body cannot be empty')], validateRequest, updateNote);
router.delete('/:noteId', deleteNote);

module.exports = router;
