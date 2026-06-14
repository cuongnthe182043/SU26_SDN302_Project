const express = require('express');
const { protect } = require('../middleware/auth.middleware');
const { getStats } = require('../controllers/dashboard.controller');

const router = express.Router();

router.get('/stats', protect, getStats);

module.exports = router;
