const bcrypt = require('bcryptjs');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');
const { signToken } = require('../utils/jwt');

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const stripUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
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

  let user = await User.findOne({ $or: [{ googleId: payload.sub }, { email: payload.email }] });

  if (user) {
    if (!user.googleId) {
      user.googleId = payload.sub;
      await user.save();
    }
  } else {
    user = await User.create({
      name: payload.name || payload.email.split('@')[0],
      email: payload.email,
      googleId: payload.sub,
    });
  }

  res.json({
    token: signToken(user._id),
    user: stripUser(user),
  });
});

const me = asyncHandler(async (req, res) => {
  res.json({ user: stripUser(req.user) });
});

module.exports = { register, login, googleLogin, me };
