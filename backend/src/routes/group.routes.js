const express = require('express');
const { body } = require('express-validator');
const { protect } = require('../middleware/auth.middleware');
const { validateRequest } = require('../middleware/validation.middleware');
const {
  listGroups,
  getGroup,
  createGroup,
  updateGroup,
  deleteGroup,
  addContactsToGroup,
  removeContactFromGroup,
} = require('../controllers/group.controller');

const router = express.Router();

router.get('/', protect, listGroups);
router.get('/:id', protect, getGroup);
router.post(
  '/',
  protect,
  [body('name').trim().notEmpty().withMessage('Group name is required')],
  validateRequest,
  createGroup
);
router.put(
  '/:id',
  protect,
  [body('name').optional().trim().notEmpty().withMessage('Group name cannot be empty')],
  validateRequest,
  updateGroup
);
router.delete('/:id', protect, deleteGroup);
router.post(
  '/:id/contacts',
  protect,
  [body('contactIds').isArray({ min: 1 }).withMessage('contactIds must be a non-empty array')],
  validateRequest,
  addContactsToGroup
);
router.delete('/:id/contacts/:contactId', protect, removeContactFromGroup);

module.exports = router;
