const User = require('../models/User');
const Referral = require('../models/Referral');
const Analytics = require('../models/Analytics');

exports.getStats = async (req, res) => {
  try {
    const { uid } = req.params;
    const referral = await Referral.findOne({ referrerUid: uid });
    const user = await User.findOne({ firebaseUid: uid });

    // Build weekly engagement chart data (last 7 days, simulated from clickLog)
    const weekData = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return {
        day: d.toLocaleDateString('en-US', { weekday: 'short' }),
        clicks: 0,
        signups: 0,
      };
    });

    if (referral) {
      referral.clickLog.forEach((c) => {
        const dayIndex = weekData.findIndex(
          (w) => w.day === new Date(c.timestamp).toLocaleDateString('en-US', { weekday: 'short' })
        );
        if (dayIndex !== -1) weekData[dayIndex].clicks++;
      });
      referral.signupLog.forEach((s) => {
        const dayIndex = weekData.findIndex(
          (w) => w.day === new Date(s.timestamp).toLocaleDateString('en-US', { weekday: 'short' })
        );
        if (dayIndex !== -1) weekData[dayIndex].signups++;
      });
    }

    res.json({
      totalReferrals: referral?.signups || 0,
      totalClicks: referral?.clicks || 0,
      conversions: referral?.conversions || 0,
      referralCode: referral?.referralCode || '',
      weeklyData: weekData,
      joinedDate: user?.createdAt,
      claimedRewards: user?.claimedRewards || []
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getLeaderboard = async (req, res) => {
  try {
    const referrals = await Referral.find().sort({ signups: -1 }).limit(10);
    const leaderboard = await Promise.all(
      referrals.map(async (r, i) => {
        const user = await User.findOne({ firebaseUid: r.referrerUid });
        return {
          rank: i + 1,
          name: user?.name || 'Unknown',
          college: user?.college || '—',
          photoURL: user?.photoURL || '',
          signups: r.signups,
          clicks: r.clicks,
        };
      })
    );
    res.json({ leaderboard });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getActivationTasks = async (req, res) => {
  try {
    const { uid } = req.params;
    const user = await User.findOne({ firebaseUid: uid });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ tasks: user.activationTasks });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const { uid } = req.params;
    const { task } = req.body;
    const update = {};
    update[`activationTasks.${task}`] = true;
    const user = await User.findOneAndUpdate({ firebaseUid: uid }, { $set: update }, { new: true });
    res.json({ tasks: user.activationTasks });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.claimReward = async (req, res) => {
  try {
    const { uid } = req.params;
    const { level } = req.body;
    
    const user = await User.findOne({ firebaseUid: uid });
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    // Check if they already claimed it
    if (user.claimedRewards && user.claimedRewards.includes(level)) {
        return res.status(400).json({ error: 'Reward already claimed' });
    }
    
    // Basic server-side verification: check signups
    const referral = await Referral.findOne({ referrerUid: uid });
    const tiers = [
        { level: 1, target: 5 },
        { level: 2, target: 25 },
        { level: 3, target: 100 },
        { level: 4, target: 500 }
    ];
    const tier = tiers.find(t => t.level === level);
    
    if (referral && referral.signups >= tier.target) {
        user.claimedRewards.push(level);
        await user.save();
        return res.json({ success: true, claimedRewards: user.claimedRewards });
    } else {
        return res.status(403).json({ error: 'Milestone not yet reached' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { uid } = req.params;
    const { name, college, phone, paymentId } = req.body;
    await User.findOneAndUpdate({ firebaseUid: uid }, { name, college, phone, paymentId });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
