const express = require('express');
const { uploadAvatar } = require('../controllers/upload.controller');
const { protect } = require('../middleware/auth.middleware');
const { upload } = require('../middleware/upload.middleware');

const router = express.Router();

router.post('/avatar', protect, upload.single('avatar'), uploadAvatar);

module.exports = router;
