const { ConsultationFee } = require('../../models');

module.exports = {
  async getAll(req, res) {
    try {
      const filters = {};
      if (req.query.hospital_id) filters.hospital_id = req.query.hospital_id;
      if (req.query.disease_id) filters.disease_id = req.query.disease_id;
      if (req.query.age_group) filters.age_group = req.query.age_group;
      if (req.query.payment_option) filters.payment_option = req.query.payment_option;
      const fees = await ConsultationFee.findAll({ where: filters });
      res.json(fees);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  async getById(req, res) {
    try {
      const fee = await ConsultationFee.findByPk(req.params.id);
      if (!fee) return res.status(404).json({ error: 'Not found' });
      res.json(fee);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  async create(req, res) {
    try {
      const fee = await ConsultationFee.create(req.body);
      res.status(201).json(fee);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
  async update(req, res) {
    try {
      const fee = await ConsultationFee.findByPk(req.params.id);
      if (!fee) return res.status(404).json({ error: 'Not found' });
      await fee.update(req.body);
      res.json(fee);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
  async delete(req, res) {
    try {
      const fee = await ConsultationFee.findByPk(req.params.id);
      if (!fee) return res.status(404).json({ error: 'Not found' });
      await fee.destroy();
      res.json({ message: 'Deleted' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
}; 