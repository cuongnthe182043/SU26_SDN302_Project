const express = require('express');
const { body } = require('express-validator');
const { protect } = require('../middleware/auth.middleware');
const { validateRequest } = require('../middleware/validation.middleware');
const noteRoutes = require('./note.routes');
const {
  addressSuggestions,
  createContact,
  deleteContact,
  getContact,
  listContacts,
  nearbyContacts,
  recentContacts,
  toggleBlacklist,
  toggleFavorite,
  updateContact,
} = require('../controllers/contact.controller');

const router = express.Router();

router.get('/recent', protect, recentContacts);
router.get('/nearby', protect, nearbyContacts);
router.get('/address-suggestions', protect, addressSuggestions);
router.use('/:contactId/notes', protect, noteRoutes);
router.get('/', protect, listContacts);
router.get('/:id', protect, getContact);
router.post(
  '/',
  protect,
  [
    body('fullName').trim().notEmpty().withMessage('Full name is required'),
    body('email').optional({ values: 'falsy' }).isEmail().withMessage('Valid email is required'),
    body('phone').optional({ values: 'falsy' }).isString().withMessage('Phone must be a string'),
    body('groups').optional().isArray().withMessage('Groups must be an array'),
  ],
  validateRequest,
  createContact
);
router.put(
  '/:id',
  protect,
  [
    body('email').optional({ values: 'falsy' }).isEmail().withMessage('Valid email is required'),
    body('phone').optional({ values: 'falsy' }).isString().withMessage('Phone must be a string'),
    body('groups').optional().isArray().withMessage('Groups must be an array'),
  ],
  validateRequest,
  updateContact
);
router.delete('/:id', protect, deleteContact);
router.patch('/:id/favorite', protect, toggleFavorite);
router.patch('/:id/blacklist', protect, toggleBlacklist);

module.exports = router;
