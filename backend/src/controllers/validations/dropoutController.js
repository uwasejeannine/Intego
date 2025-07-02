const db = require('../../../models');
const Dropout = db.Dropout;

exports.getAllDropouts = async (req, res) => {
  try {
    const dropouts = await Dropout.findAll();
    res.json(dropouts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getDropoutById = async (req, res) => {
  try {
    const dropout = await Dropout.findByPk(req.params.id);
    if (!dropout) return res.status(404).json({ error: 'Dropout not found' });
    res.json(dropout);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createDropout = async (req, res) => {
  try {
    const dropout = await Dropout.create(req.body);
    res.status(201).json(dropout);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateDropout = async (req, res) => {
  try {
    const dropout = await Dropout.findByPk(req.params.id);
    if (!dropout) return res.status(404).json({ error: 'Dropout not found' });
    await dropout.update(req.body);
    res.json(dropout);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteDropout = async (req, res) => {
  try {
    const dropout = await Dropout.findByPk(req.params.id);
    if (!dropout) return res.status(404).json({ error: 'Dropout not found' });
    await dropout.destroy();
    res.json({ message: 'Dropout deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 