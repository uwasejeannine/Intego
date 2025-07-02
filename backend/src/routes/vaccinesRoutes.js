const express = require('express');
const router = express.Router();
const vaccinesController = require('../controllers/validations/vaccinesController');

router.get('/', vaccinesController.getAll);
router.get('/:id', vaccinesController.getById);
router.post('/', vaccinesController.create);
router.put('/:id', vaccinesController.update);
router.delete('/:id', vaccinesController.delete);

module.exports = router; 