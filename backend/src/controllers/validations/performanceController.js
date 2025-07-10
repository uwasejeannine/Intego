const db = require('../../../models');
const Performance = db.Performance;

exports.getAllPerformances = async (req, res) => {
  try {
    const performances = await Performance.findAll();
    res.json(performances);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getPerformanceById = async (req, res) => {
  try {
    const performance = await Performance.findByPk(req.params.id);
    if (!performance) return res.status(404).json({ error: 'Performance not found' });
    res.json(performance);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createPerformance = async (req, res) => {
  try {
    const performance = await Performance.create(req.body);
    res.status(201).json(performance);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updatePerformance = async (req, res) => {
  try {
    const performance = await Performance.findByPk(req.params.id);
    if (!performance) return res.status(404).json({ error: 'Performance not found' });
    await performance.update(req.body);
    res.json(performance);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deletePerformance = async (req, res) => {
  try {
    const performance = await Performance.findByPk(req.params.id);
    if (!performance) return res.status(404).json({ error: 'Performance not found' });
    await performance.destroy();
    res.json({ message: 'Performance deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 