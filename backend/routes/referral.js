const express = require('express');
const router = express.Router();
const referralController = require('../controllers/referralController');

router.get('/:code/click', referralController.trackClick);
router.get('/stats/:uid', referralController.getReferralStats);

module.exports = router;
