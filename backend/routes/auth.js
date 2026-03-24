const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/verify', authController.verifyAndLogin);
router.post('/onboarding', authController.completeOnboarding);
router.get('/me', authController.getMe);

module.exports = router;
