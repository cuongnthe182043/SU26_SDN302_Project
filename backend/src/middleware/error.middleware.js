const AppError = require('../utils/AppError');

const notFound = (_req, _res, next) => next(new AppError('Route not found', 404));

const errorHandler = (err, _req, res, _next) => {
  const statusCode = err.statusCode || 500;
  const response = {
    message: err.message || 'Server error',
  };

  if (err.name === 'CastError') {
    return res.status(400).json({ message: 'Invalid resource id' });
  }

  if (err.code === 11000) {
    return res.status(409).json({ message: 'Duplicate resource' });
  }

  res.status(statusCode).json(response);
};

module.exports = { notFound, errorHandler };
