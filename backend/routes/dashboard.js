const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

router.get('/stats/:uid', dashboardController.getStats);
router.get('/leaderboard', dashboardController.getLeaderboard);
router.get('/activation/:uid', dashboardController.getActivationTasks);
router.post('/activation/:uid/task', dashboardController.updateTask);
router.post('/claim-reward/:uid', dashboardController.claimReward);

module.exports = router;
