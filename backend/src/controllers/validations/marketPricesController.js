const db = require('../../../models');
const MarketPrices = db.MarketPrices;

class MarketPricesController {
  static async getAll(req, res) {
    try {
      const prices = await MarketPrices.findAll();
      res.status(200).json(prices);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getById(req, res) {
    try {
      const price = await MarketPrices.findByPk(req.params.id);
      if (!price) return res.status(404).json({ error: 'Market price not found' });
      res.status(200).json(price);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async create(req, res) {
    try {
      const price = await MarketPrices.create(req.body);
      res.status(201).json(price);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async update(req, res) {
    try {
      const [updated] = await MarketPrices.update(req.body, { where: { id: req.params.id } });
      if (!updated) return res.status(404).json({ error: 'Market price not found' });
      const updatedPrice = await MarketPrices.findByPk(req.params.id);
      res.status(200).json(updatedPrice);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async delete(req, res) {
    try {
      const deleted = await MarketPrices.destroy({ where: { id: req.params.id } });
      if (!deleted) return res.status(404).json({ error: 'Market price not found' });
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getSuggestions(req, res) {
    try {
      const db = require('../../../models');
      const MarketPrices = db.MarketPrices;
      // Get all crops with their average price
      const [results] = await db.sequelize.query(`
        SELECT crop, AVG(price) as suggestedPrice, unit
        FROM market_prices
        GROUP BY crop, unit
      `);
      const suggestions = results.map(row => ({
        crop: row.crop,
        suggestedPrice: Math.round(row.suggestedPrice),
        unit: row.unit,
        basis: 'Average of all recorded prices'
      }));
      res.status(200).json(suggestions);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = MarketPricesController; 