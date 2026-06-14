const express = require('express');
const { protect } = require('../middleware/auth.middleware');
const { callback, connect, sync } = require('../controllers/google.controller');

const router = express.Router();

router.get('/connect', protect, connect);
router.get('/callback', callback);
router.post('/sync', protect, sync);

module.exports = router;
