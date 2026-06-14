const jwt = require('jsonwebtoken');

const signToken = (userId) =>
  jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

const verifyToken = (token) => jwt.verify(token, process.env.JWT_SECRET);

const signGoogleStateToken = (userId) =>
  jwt.sign(
    { userId, purpose: 'google-oauth' },
    process.env.JWT_SECRET,
    { expiresIn: '10m' }
  );

const verifyGoogleStateToken = (token) => {
  const payload = jwt.verify(token, process.env.JWT_SECRET);
  if (payload.purpose !== 'google-oauth') {
    throw new Error('Invalid Google OAuth state token');
  }
  return payload;
};

module.exports = {
  signToken,
  verifyToken,
  signGoogleStateToken,
  verifyGoogleStateToken,
};
