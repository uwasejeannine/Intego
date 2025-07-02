const { SpecializedTreatment } = require('../../models');

module.exports = {
  async getAll(req, res) {
    try {
      const filters = {};
      if (req.query.hospital_id) filters.hospital_id = req.query.hospital_id;
      if (req.query.type) filters.type = req.query.type;
      const treatments = await SpecializedTreatment.findAll({ where: filters });
      res.json(treatments);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  async getById(req, res) {
    try {
      const treatment = await SpecializedTreatment.findByPk(req.params.id);
      if (!treatment) return res.status(404).json({ error: 'Not found' });
      res.json(treatment);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  async create(req, res) {
    try {
      const treatment = await SpecializedTreatment.create(req.body);
      res.status(201).json(treatment);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
  async update(req, res) {
    try {
      const treatment = await SpecializedTreatment.findByPk(req.params.id);
      if (!treatment) return res.status(404).json({ error: 'Not found' });
      await treatment.update(req.body);
      res.json(treatment);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
  async delete(req, res) {
    try {
      const treatment = await SpecializedTreatment.findByPk(req.params.id);
      if (!treatment) return res.status(404).json({ error: 'Not found' });
      await treatment.destroy();
      res.json({ message: 'Deleted' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
}; 