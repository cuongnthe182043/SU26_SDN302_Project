const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');
const { signToken } = require('../utils/jwt');
const { sendPasswordResetEmail, sendWelcomeEmail } = require('../services/email.service');

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const RESET_TOKEN_TTL_MS = 15 * 60 * 1000;

// Google users authenticate through Google, not with a password. We still store
// a hashed random secret so the account has a non-guessable password field; if
// they ever want password login they set one via the forgot-password flow.
const hashRandomPassword = () => bcrypt.hash(crypto.randomBytes(32).toString('hex'), 12);

// Fire-and-forget: a failed welcome email must never block sign-up.
const sendWelcomeEmailSafe = (user) => {
  sendWelcomeEmail({ email: user.email, name: user.name }).catch((err) => {
    console.error('Failed to send welcome email:', err.message);
  });
};

const stripUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  phone: user.phone,
  avatarUrl: user.avatarUrl,
  googleConnected: user.googleConnected,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const exists = await User.findOne({ email });

  if (exists) {
    throw new AppError('Email already in use', 409);
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const user = await User.create({ name, email, password: hashedPassword });

  sendWelcomeEmailSafe(user);

  res.status(201).json({
    token: signToken(user._id),
    user: stripUser(user),
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+password');

  if (!user || !user.password) {
    throw new AppError('Invalid credentials', 401);
  }

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    throw new AppError('Invalid credentials', 401);
  }

  res.json({
    token: signToken(user._id),
    user: stripUser(user),
  });
});

const googleLogin = asyncHandler(async (req, res) => {
  const { credential } = req.body;

  let payload;
  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    payload = ticket.getPayload();
  } catch {
    throw new AppError('Invalid Google credential', 401);
  }

  if (!payload?.email) {
    throw new AppError('Google account has no email', 400);
  }

  let user = await User.findOne({ $or: [{ googleId: payload.sub }, { email: payload.email }] }).select('+password');
  let isNewUser = false;

  if (user) {
    let changed = false;
    if (!user.googleId) {
      user.googleId = payload.sub;
      changed = true;
    }
    if (!user.password) {
      user.password = await hashRandomPassword();
      changed = true;
    }
    if (changed) {
      await user.save();
    }
  } else {
    const hashedPassword = await hashRandomPassword();
    user = await User.create({
      name: payload.name || payload.email.split('@')[0],
      email: payload.email,
      googleId: payload.sub,
      password: hashedPassword,
    });
    isNewUser = true;
  }

  if (isNewUser) {
    sendWelcomeEmailSafe(user);
  }

  res.json({
    token: signToken(user._id),
    user: stripUser(user),
    isNewUser,
  });
});

const me = asyncHandler(async (req, res) => {
  res.json({ user: stripUser(req.user) });
});

const updateProfile = asyncHandler(async (req, res) => {
  const { name, phone, avatarUrl } = req.body;

  if (name !== undefined) req.user.name = name;
  if (phone !== undefined) req.user.phone = phone;
  if (avatarUrl !== undefined) req.user.avatarUrl = avatarUrl;

  await req.user.save();

  res.json({ user: stripUser(req.user) });
});

const GENERIC_RESET_MESSAGE = 'If that email is registered, a reset link has been sent to it.';

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  // Always return the same response so an attacker cannot tell whether the
  // email is registered (anti-enumeration).
  if (!user) {
    res.json({ message: GENERIC_RESET_MESSAGE });
    return;
  }

  const rawToken = crypto.randomBytes(32).toString('hex');
  user.resetPasswordToken = crypto.createHash('sha256').update(rawToken).digest('hex');
  user.resetPasswordExpires = Date.now() + RESET_TOKEN_TTL_MS;
  await user.save();

  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${rawToken}`;

  try {
    await sendPasswordResetEmail({ email: user.email, name: user.name, resetUrl });
  } catch (err) {
    // Do not leak the failure to the client; log it for operators instead.
    console.error('Failed to send password reset email:', err.message);
  }

  res.json({ message: GENERIC_RESET_MESSAGE });
});

const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: Date.now() },
  }).select('+resetPasswordToken +resetPasswordExpires');

  if (!user) {
    throw new AppError('Reset link is invalid or has expired', 400);
  }

  user.password = await bcrypt.hash(password, 12);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  res.json({ message: 'Password has been reset successfully' });
});

module.exports = { register, login, googleLogin, me, updateProfile, forgotPassword, resetPassword };
