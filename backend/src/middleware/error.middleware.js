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

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ message: 'Session expired, please log in again' });
  }

  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ message: 'Not authorized' });
  }

  if (err.code === 11000) {
    const duplicateMessages = {
      phone: 'A contact with this phone number already exists',
      googleId: 'This Google contact has already been imported',
      email: 'A user with this email already exists',
      name: 'A group with this name already exists',
    };
    const field = Object.keys(err.keyPattern || {}).find((key) => key !== 'owner');
    return res.status(409).json({ message: duplicateMessages[field] || 'Duplicate resource' });
  }

  res.status(statusCode).json(response);
};

module.exports = { notFound, errorHandler };
