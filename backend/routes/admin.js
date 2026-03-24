const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (email === adminEmail && password === adminPassword) {
    res.json({
      user: {
        name: 'Hush AI Admin',
        email: adminEmail,
        role: 'admin',
        firebaseUid: 'admin-system-id',
        photoURL: 'https://cdn-icons-png.flaticon.com/512/6024/6024190.png'
      }
    });
  } else {
    res.status(401).json({ error: 'Invalid admin credentials' });
  }
});

const Referral = require('../models/Referral');

router.get('/stats', async (req, res) => {
  try {
    const totalAmbassadors = await User.countDocuments({ role: 'ambassador' });
    const stats = await Referral.aggregate([
      {
        $group: {
          _id: null,
          totalClicks: { $sum: '$clicks' },
          totalSignups: { $sum: '$signups' }
        }
      }
    ]);

    const collegeBreakdown = await User.aggregate([
      { $match: { role: 'ambassador' } },
      { $group: { _id: '$college', count: { $sum: 1 } } }
    ]);

    res.json({
      totalAmbassadors,
      totalClicks: stats[0]?.totalClicks || 0,
      totalSignups: stats[0]?.totalSignups || 0,
      collegeBreakdown
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/ambassadors', async (req, res) => {
  try {
    // Basic aggregation to join User with their Referral stats
    const ambassadors = await User.aggregate([
      { $match: { role: 'ambassador' } },
      {
        $lookup: {
          from: 'referrals',
          localField: 'firebaseUid',
          foreignField: 'referrerUid',
          as: 'stats'
        }
      },
      {
        $lookup: {
          from: 'analytics',
          let: { userUid: '$firebaseUid' },
          pipeline: [
            { $match: { $expr: { $eq: ['$uid', '$$userUid'] } } },
            { $sort: { timestamp: -1 } },
            { $limit: 1 }
          ],
          as: 'lastActivity'
        }
      },
      {
        $project: {
          name: 1,
          email: 1,
          photoURL: 1,
          college: 1,
          onboardingComplete: 1,
          referralCode: 1,
          lastActive: 1,
          createdAt: 1,
          stats: { $arrayElemAt: ['$stats', 0] },
          lastActivity: { $arrayElemAt: ['$lastActivity', 0] }
        }
      },
      { $sort: { createdAt: -1 } }
    ]);
    res.json({ ambassadors });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
