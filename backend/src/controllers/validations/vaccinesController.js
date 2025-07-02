const db = require('../../../models');
const Vaccine = db.Vaccine;

exports.getAll = async (req, res) => {
  try {
    const vaccines = await Vaccine.findAll();
    res.json(vaccines);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const vaccine = await Vaccine.findByPk(req.params.id);
    if (!vaccine) return res.status(404).json({ error: 'Not found' });
    res.json(vaccine);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const vaccine = await Vaccine.create(req.body);
    res.status(201).json(vaccine);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const vaccine = await Vaccine.findByPk(req.params.id);
    if (!vaccine) return res.status(404).json({ error: 'Not found' });
    await vaccine.update(req.body);
    res.json(vaccine);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const vaccine = await Vaccine.findByPk(req.params.id);
    if (!vaccine) return res.status(404).json({ error: 'Not found' });
    await vaccine.destroy();
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 