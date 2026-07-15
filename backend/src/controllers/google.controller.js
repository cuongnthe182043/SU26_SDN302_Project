const User = require('../models/User');
const Contact = require('../models/Contact');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');
const {
  buildGoogleAuthUrl,
  exchangeCodeForTokens,
  fetchGoogleContacts,
  resolveGoogleState,
} = require('../services/google.service');
const { geocodeAddress } = require('../services/geocoding.service');

// Google returns "invalid_grant" when the refresh token is expired or revoked
// (e.g. 7-day expiry while the OAuth app is in "Testing", or the user revoked access).
const isInvalidGrant = (err) =>
  err?.response?.data?.error === 'invalid_grant' || /invalid_grant/i.test(err?.message || '');

const connect = asyncHandler(async (req, res) => {
  if (!req.user) {
    throw new AppError('Not authorized', 401);
  }

  res.json({ url: buildGoogleAuthUrl(req.user._id.toString()) });
});

const callback = asyncHandler(async (req, res) => {
  const { code, state } = req.query;

  if (!code || !state) {
    throw new AppError('Missing OAuth parameters', 400);
  }

  const userId = resolveGoogleState(state);
  const tokens = await exchangeCodeForTokens(code);
  const user = await User.findById(userId).select('+googleRefreshToken');

  if (!user) {
    throw new AppError('User not found', 404);
  }

  user.googleConnected = true;
  user.googleRefreshToken = tokens.refresh_token || user.googleRefreshToken;
  await user.save();

  const redirectUrl = `${process.env.FRONTEND_URL || 'http://localhost:5175'}/dashboard?google=connected`;
  res.redirect(redirectUrl);
});

const sync = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('+googleRefreshToken');
  if (!user?.googleRefreshToken) {
    throw new AppError('Google account is not connected', 400);
  }

  let googleContacts;
  try {
    googleContacts = await fetchGoogleContacts(user.googleRefreshToken);
  } catch (err) {
    if (isInvalidGrant(err)) {
      // The stored refresh token no longer works — clear it and ask the user to reconnect.
      user.googleConnected = false;
      user.googleRefreshToken = undefined;
      await user.save();
      // 400 (not 401) so the frontend's auth interceptor doesn't log the user out of the app.
      throw new AppError('Google connection has expired. Please connect Google again.', 400);
    }
    throw err;
  }

  let imported = 0;
  let skipped = 0;

  for (const item of googleContacts) {
    const location = item.address ? await geocodeAddress(item.address) : null;
    const payload = {
      owner: user._id,
      fullName: item.fullName,
      email: item.email || undefined,
      phone: item.phone || undefined,
      address: item.address || undefined,
      birthday: item.birthday || undefined,
      avatarUrl: item.avatarUrl || undefined,
      source: 'google',
      googleId: item.googleId,
      location: location ? { type: 'Point', coordinates: [location.longitude, location.latitude] } : undefined,
    };

    try {
      await Contact.updateOne(
        { owner: user._id, googleId: item.googleId },
        { $set: payload },
        { upsert: true }
      );
      imported += 1;
    } catch (err) {
      // Skip a single bad contact (e.g. duplicate phone) instead of aborting the whole sync.
      console.error(`Skipped Google contact "${item.fullName}":`, err.message);
      skipped += 1;
    }
  }

  res.json({ imported, skipped });
});

module.exports = { connect, callback, sync };
