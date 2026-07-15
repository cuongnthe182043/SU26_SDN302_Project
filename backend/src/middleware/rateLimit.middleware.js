const rateLimit = require('express-rate-limit');

// Throttles sensitive auth endpoints to slow down brute-force and spam.
// Counts by client IP; failed and successful attempts both count.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many attempts, please try again later' },
});

module.exports = { authLimiter };
