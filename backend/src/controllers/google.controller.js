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

  const redirectUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard?google=connected`;
  res.redirect(redirectUrl);
});

const sync = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('+googleRefreshToken');
  if (!user?.googleRefreshToken) {
    throw new AppError('Google account is not connected', 400);
  }

  const googleContacts = await fetchGoogleContacts(user.googleRefreshToken);
  let imported = 0;

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

    await Contact.updateOne(
      { owner: user._id, googleId: item.googleId },
      { $set: payload },
      { upsert: true }
    );
    imported += 1;
  }

  res.json({ imported });
});

module.exports = { connect, callback, sync };
