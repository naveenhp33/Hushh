const Analytics = require('../models/Analytics');

exports.trackEvent = async (req, res) => {
  try {
    const { uid, event, step, metadata } = req.body;
    await Analytics.create({ uid, event, step, metadata });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getDropoffStats = async (req, res) => {
  try {
    const pipeline = [
      { $group: { _id: { event: '$event', step: '$step' }, count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ];
    const stats = await Analytics.aggregate(pipeline);
    res.json({ stats });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
