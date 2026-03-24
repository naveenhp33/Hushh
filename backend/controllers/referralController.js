const Referral = require('../models/Referral');
const User = require('../models/User');

exports.trackClick = async (req, res) => {
  try {
    const { code } = req.params;
    const referral = await Referral.findOneAndUpdate(
      { referralCode: code },
      {
        $inc: { clicks: 1 },
        $push: { clickLog: { timestamp: new Date(), ip: req.ip } },
      },
      { new: true }
    );
    if (!referral) return res.status(404).json({ error: 'Invalid referral code' });
    res.json({ message: 'Click tracked', clicks: referral.clicks });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getReferralStats = async (req, res) => {
  try {
    const { uid } = req.params;
    const user = await User.findOne({ firebaseUid: uid });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const referral = await Referral.findOne({ referrerUid: uid });
    if (!referral) return res.json({ clicks: 0, signups: 0, conversions: 0, referralCode: '' });

    res.json({
      clicks: referral.clicks,
      signups: referral.signups,
      conversions: referral.conversions,
      referralCode: referral.referralCode,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
