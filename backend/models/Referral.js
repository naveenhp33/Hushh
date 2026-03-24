const mongoose = require('mongoose');

const referralSchema = new mongoose.Schema({
  referrerUid: { type: String, required: true },
  referralCode: { type: String, required: true },
  clicks: { type: Number, default: 0 },
  signups: { type: Number, default: 0 },
  conversions: { type: Number, default: 0 },
  clickLog: [{ timestamp: Date, ip: String }],
  signupLog: [{ uid: String, timestamp: Date }],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Referral', referralSchema);
