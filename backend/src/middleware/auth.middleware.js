const User = require('../models/User');
const AppError = require('../utils/AppError');
const { verifyToken } = require('../utils/jwt');
const asyncHandler = require('../utils/asyncHandler');

const protect = asyncHandler(async (req, _res, next) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    throw new AppError('Not authorized', 401);
  }

  const token = header.split(' ')[1];
  const payload = verifyToken(token);
  const user = await User.findById(payload.userId);

  if (!user) {
    throw new AppError('Not authorized', 401);
  }

  req.user = user;
  next();
});

module.exports = { protect };
