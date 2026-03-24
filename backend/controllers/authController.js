const admin = require('../config/firebase');
const User = require('../models/User');
const Referral = require('../models/Referral');
const Analytics = require('../models/Analytics');
const { v4: uuidv4 } = require('uuid');

const generateReferralCode = (name) => {
  const base = name.replace(/\s+/g, '').toUpperCase().slice(0, 5);
  return `${base}-${uuidv4().slice(0, 6).toUpperCase()}`;
};

exports.verifyAndLogin = async (req, res) => {
  try {
    const { idToken } = req.body;
    if (!idToken) return res.status(400).json({ error: 'No token provided' });

    // Check if Firebase is initialized
    if (!admin.apps.length) {
      console.error('❌ Firebase Admin is not initialized. Please set FIREBASE_SERVICE_ACCOUNT in .env');
      return res.status(503).json({ error: 'Authentication service not initialized' });
    }

    const decoded = await admin.auth().verifyIdToken(idToken);
    const { uid, email, name, picture } = decoded;

    let user = await User.findOne({ firebaseUid: uid });
    if (!user) {
      const referralCode = generateReferralCode(name || 'USER');
      user = await User.create({
        firebaseUid: uid,
        email,
        name: name || 'Ambassador',
        photoURL: picture || '',
        referralCode,
      });
      await Referral.create({ referrerUid: uid, referralCode });
      await Analytics.create({ uid, event: 'login', step: 'new_user' });
    } else {
      user.lastActive = new Date();
      await user.save();
      await Analytics.create({ uid, event: 'login', step: 'returning_user' });
    }

    res.json({ user });
  } catch (err) {
    console.error('Auth error:', err);
    res.status(401).json({ error: 'Authentication failed' });
  }
};

exports.completeOnboarding = async (req, res) => {
  try {
    const { uid, college, interests } = req.body;
    const user = await User.findOneAndUpdate(
      { firebaseUid: uid },
      {
        college,
        interests,
        onboardingComplete: true,
        'activationTasks.profileComplete': true,
      },
      { new: true }
    );
    await Analytics.create({ uid, event: 'onboarding', step: 'complete' });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    const { uid } = req.query;
    const user = await User.findOne({ firebaseUid: uid });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
