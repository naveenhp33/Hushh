const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  uid: { type: String },
  event: { type: String, required: true }, // 'login', 'onboarding', 'dashboard', 'drop_off'
  step: { type: String },
  timestamp: { type: Date, default: Date.now },
  metadata: { type: Object },
});

module.exports = mongoose.model('Analytics', analyticsSchema);
