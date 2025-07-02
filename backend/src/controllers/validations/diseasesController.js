const { Disease } = require('../../../models');

module.exports = {
  async getAll(req, res) {
    try {
      const filters = {};
      if (req.query.name) filters.name = req.query.name;
      if (req.query.available_at) filters.available_at = req.query.available_at;
      if (req.query.referral_required) filters.referral_required = req.query.referral_required === 'true';
      const diseases = await Disease.findAll({ where: filters });
      res.json(diseases);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  async getById(req, res) {
    try {
      const disease = await Disease.findByPk(req.params.id);
      if (!disease) return res.status(404).json({ error: 'Not found' });
      res.json(disease);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  async create(req, res) {
    try {
      const disease = await Disease.create(req.body);
      res.status(201).json(disease);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
  async update(req, res) {
    try {
      const disease = await Disease.findByPk(req.params.id);
      if (!disease) return res.status(404).json({ error: 'Not found' });
      await disease.update(req.body);
      res.json(disease);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
  async delete(req, res) {
    try {
      const disease = await Disease.findByPk(req.params.id);
      if (!disease) return res.status(404).json({ error: 'Not found' });
      await disease.destroy();
      res.json({ message: 'Deleted' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
}; 