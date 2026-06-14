const path = require('path');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');

const uploadAvatar = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new AppError('Avatar file is required', 400);
  }

  const baseUrl = process.env.API_BASE_URL || `${req.protocol}://${req.get('host')}`;
  const fileUrl = `${baseUrl}/uploads/${path.basename(req.file.filename)}`;

  res.status(201).json({ url: fileUrl });
});

module.exports = { uploadAvatar };
