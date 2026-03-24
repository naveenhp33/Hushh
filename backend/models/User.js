const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firebaseUid: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  photoURL: { type: String },
  college: { type: String },
  interests: [{ type: String }],
  onboardingComplete: { type: Boolean, default: false },
  referralCode: { type: String, unique: true },
  referredBy: { type: String },
  lastActive: { type: Date, default: Date.now },
  role: { type: String, enum: ['ambassador', 'admin'], default: 'ambassador' },
  createdAt: { type: Date, default: Date.now },
  activationTasks: {
    profileComplete: { type: Boolean, default: false },
    sharedReferral: { type: Boolean, default: false },
    firstSignup: { type: Boolean, default: false },
    engagedWeek: { type: Boolean, default: false },
    reachedTop10: { type: Boolean, default: false },
  },
  claimedRewards: [{ type: Number }], // Array of level numbers claimed
});

module.exports = mongoose.model('User', userSchema);
