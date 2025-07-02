const db = require('../../../models');
const VaccinationRecord = db.VaccinationRecord;

exports.getAll = async (req, res) => {
  try {
    const records = await VaccinationRecord.findAll();
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const record = await VaccinationRecord.findByPk(req.params.id);
    if (!record) return res.status(404).json({ error: 'Not found' });
    res.json(record);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const record = await VaccinationRecord.create(req.body);
    res.status(201).json(record);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const record = await VaccinationRecord.findByPk(req.params.id);
    if (!record) return res.status(404).json({ error: 'Not found' });
    await record.update(req.body);
    res.json(record);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const record = await VaccinationRecord.findByPk(req.params.id);
    if (!record) return res.status(404).json({ error: 'Not found' });
    await record.destroy();
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 