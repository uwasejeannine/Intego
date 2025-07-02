const db = require('../../../models');
const Infrastructure = db.Infrastructure;

exports.getAllInfrastructures = async (req, res) => {
  try {
    const infrastructures = await Infrastructure.findAll();
    res.json(infrastructures);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getInfrastructureById = async (req, res) => {
  try {
    const infrastructure = await Infrastructure.findByPk(req.params.id);
    if (!infrastructure) return res.status(404).json({ error: 'Infrastructure not found' });
    res.json(infrastructure);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createInfrastructure = async (req, res) => {
  try {
    const infrastructure = await Infrastructure.create(req.body);
    res.status(201).json(infrastructure);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateInfrastructure = async (req, res) => {
  try {
    const infrastructure = await Infrastructure.findByPk(req.params.id);
    if (!infrastructure) return res.status(404).json({ error: 'Infrastructure not found' });
    await infrastructure.update(req.body);
    res.json(infrastructure);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteInfrastructure = async (req, res) => {
  try {
    const infrastructure = await Infrastructure.findByPk(req.params.id);
    if (!infrastructure) return res.status(404).json({ error: 'Infrastructure not found' });
    await infrastructure.destroy();
    res.json({ message: 'Infrastructure deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 