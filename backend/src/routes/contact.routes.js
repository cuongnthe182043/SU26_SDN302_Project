const express = require('express');
const { body } = require('express-validator');
const { protect } = require('../middleware/auth.middleware');
const { validateRequest } = require('../middleware/validation.middleware');
const { NAME_PATTERN, nameCharsMessage } = require('../utils/validators');
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

const contactFieldRules = [
  body('email').optional({ values: 'falsy' }).isEmail().withMessage('Valid email is required'),
  body('phone')
    .optional({ values: 'falsy' })
    .matches(/^[+()0-9.\-\s]{6,20}$/)
    .withMessage('Phone must be 6-20 characters and contain only digits, spaces, +()-.'),
  body('birthday').optional({ values: 'falsy' }).isISO8601().withMessage('Birthday must be a valid date'),
  body('note').optional({ values: 'falsy' }).isLength({ max: 2000 }).withMessage('Note must be at most 2000 characters'),
  body('address').optional({ values: 'falsy' }).isLength({ max: 500 }).withMessage('Address must be at most 500 characters'),
  body('avatarUrl')
    .optional({ values: 'falsy' })
    .isURL({ require_tld: false })
    .withMessage('Avatar URL must be a valid URL'),
  body('groups').optional().isArray().withMessage('Groups must be an array'),
];

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
    body('fullName')
      .trim()
      .notEmpty()
      .withMessage('Full name is required')
      .isLength({ max: 120 })
      .withMessage('Full name must be at most 120 characters')
      .matches(NAME_PATTERN)
      .withMessage(nameCharsMessage('Full name')),
    ...contactFieldRules,
  ],
  validateRequest,
  createContact
);
router.put(
  '/:id',
  protect,
  [
    body('fullName')
      .optional()
      .trim()
      .isLength({ min: 1, max: 120 })
      .withMessage('Full name must be between 1 and 120 characters')
      .matches(NAME_PATTERN)
      .withMessage(nameCharsMessage('Full name')),
    ...contactFieldRules,
  ],
  validateRequest,
  updateContact
);
router.delete('/:id', protect, deleteContact);
router.patch('/:id/favorite', protect, toggleFavorite);
router.patch('/:id/blacklist', protect, toggleBlacklist);

module.exports = router;
