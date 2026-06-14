const { validationResult } = require('express-validator');
const AppError = require('../utils/AppError');

const validateRequest = (req, _res, next) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    throw new AppError(result.array().map((item) => item.msg).join(', '), 400);
  }
  next();
};

module.exports = { validateRequest };
