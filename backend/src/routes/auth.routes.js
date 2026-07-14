const express = require('express');
const { body, param } = require('express-validator');
const {
  forgotPassword,
  googleLogin,
  login,
  me,
  register,
  resetPassword,
  updateProfile,
} = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');
const { validateRequest } = require('../middleware/validation.middleware');

const router = express.Router();

router.post(
  '/register',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  ],
  validateRequest,
  register
);

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  validateRequest,
  login
);

router.post(
  '/google',
  [body('credential').notEmpty().withMessage('Google credential is required')],
  validateRequest,
  googleLogin
);

router.post(
  '/forgot-password',
  [body('email').isEmail().withMessage('Valid email is required').normalizeEmail()],
  validateRequest,
  forgotPassword
);

router.post(
  '/reset-password/:token',
  [
    param('token').notEmpty().withMessage('Reset token is required'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  ],
  validateRequest,
  resetPassword
);

router.get('/me', protect, me);

router.put(
  '/profile',
  protect,
  [
    body('name').optional().trim().notEmpty().withMessage('Name cannot be empty').isLength({ max: 120 }).withMessage('Name must be at most 120 characters'),
    body('phone')
      .optional({ values: 'falsy' })
      .matches(/^[+()0-9.\-\s]{6,20}$/)
      .withMessage('Phone must be 6-20 characters and contain only digits, spaces, +()-.'),
    body('avatarUrl')
      .optional({ values: 'falsy' })
      .isURL({ require_tld: false })
      .withMessage('Avatar URL must be a valid URL'),
  ],
  validateRequest,
  updateProfile
);

module.exports = router;
