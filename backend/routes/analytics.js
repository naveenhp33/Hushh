const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');

router.post('/track', analyticsController.trackEvent);
router.get('/dropoff', analyticsController.getDropoffStats);

module.exports = router;
