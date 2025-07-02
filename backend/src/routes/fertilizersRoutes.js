const express = require('express');
const router = express.Router();
const FertilizersController = require('../controllers/validations/fertilizersController');

router.get('/', FertilizersController.getAll);
router.get('/:id', FertilizersController.getById);
router.post('/', FertilizersController.create);
router.put('/:id', FertilizersController.update);
router.delete('/:id', FertilizersController.delete);

module.exports = router; 