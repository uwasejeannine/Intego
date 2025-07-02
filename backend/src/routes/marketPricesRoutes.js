const express = require('express');
const router = express.Router();
const MarketPricesController = require('../controllers/validations/marketPricesController');

router.get('/', MarketPricesController.getAll);
router.get('/:id', MarketPricesController.getById);
router.post('/', MarketPricesController.create);
router.put('/:id', MarketPricesController.update);
router.delete('/:id', MarketPricesController.delete);
router.get('/suggestions', MarketPricesController.getSuggestions);

module.exports = router; 