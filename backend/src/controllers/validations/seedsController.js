const db = require('../../../models');
const Seeds = db.Seeds;

class SeedsController {
  static async getAll(req, res) {
    try {
      const seeds = await Seeds.findAll();
      res.status(200).json(seeds);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getById(req, res) {
    try {
      const seed = await Seeds.findByPk(req.params.id);
      if (!seed) return res.status(404).json({ error: 'Seed not found' });
      res.status(200).json(seed);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async create(req, res) {
    try {
      const seed = await Seeds.create(req.body);
      res.status(201).json(seed);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async update(req, res) {
    try {
      const [updated] = await Seeds.update(req.body, { where: { id: req.params.id } });
      if (!updated) return res.status(404).json({ error: 'Seed not found' });
      const updatedSeed = await Seeds.findByPk(req.params.id);
      res.status(200).json(updatedSeed);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async delete(req, res) {
    try {
      const deleted = await Seeds.destroy({ where: { id: req.params.id } });
      if (!deleted) return res.status(404).json({ error: 'Seed not found' });
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = SeedsController; 