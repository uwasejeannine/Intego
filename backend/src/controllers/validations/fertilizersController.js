const db = require('../../../models');
const Fertilizers = db.Fertilizers;

class FertilizersController {
  static async getAll(req, res) {
    try {
      const fertilizers = await Fertilizers.findAll();
      res.status(200).json(fertilizers);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getById(req, res) {
    try {
      const fertilizer = await Fertilizers.findByPk(req.params.id);
      if (!fertilizer) return res.status(404).json({ error: 'Fertilizer not found' });
      res.status(200).json(fertilizer);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async create(req, res) {
    try {
      const fertilizer = await Fertilizers.create(req.body);
      res.status(201).json(fertilizer);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async update(req, res) {
    try {
      const [updated] = await Fertilizers.update(req.body, { where: { id: req.params.id } });
      if (!updated) return res.status(404).json({ error: 'Fertilizer not found' });
      const updatedFertilizer = await Fertilizers.findByPk(req.params.id);
      res.status(200).json(updatedFertilizer);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async delete(req, res) {
    try {
      const deleted = await Fertilizers.destroy({ where: { id: req.params.id } });
      if (!deleted) return res.status(404).json({ error: 'Fertilizer not found' });
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = FertilizersController; 