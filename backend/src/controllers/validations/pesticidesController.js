const db = require('../../../models');
const Pesticides = db.Pesticides;

class PesticidesController {
  static async getAll(req, res) {
    try {
      const pesticides = await Pesticides.findAll();
      res.status(200).json(pesticides);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getById(req, res) {
    try {
      const pesticide = await Pesticides.findByPk(req.params.id);
      if (!pesticide) return res.status(404).json({ error: 'Pesticide not found' });
      res.status(200).json(pesticide);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async create(req, res) {
    try {
      const pesticide = await Pesticides.create(req.body);
      res.status(201).json(pesticide);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async update(req, res) {
    try {
      const [updated] = await Pesticides.update(req.body, { where: { id: req.params.id } });
      if (!updated) return res.status(404).json({ error: 'Pesticide not found' });
      const updatedPesticide = await Pesticides.findByPk(req.params.id);
      res.status(200).json(updatedPesticide);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async delete(req, res) {
    try {
      const deleted = await Pesticides.destroy({ where: { id: req.params.id } });
      if (!deleted) return res.status(404).json({ error: 'Pesticide not found' });
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = PesticidesController; 