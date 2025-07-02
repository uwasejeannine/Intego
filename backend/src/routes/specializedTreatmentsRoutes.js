const express = require('express');
const router = express.Router();
const specializedTreatmentsController = require('../controllers/validations/specializedTreatmentsController');

router.get('/', specializedTreatmentsController.getAll);
router.get('/:id', specializedTreatmentsController.getById);
router.post('/', specializedTreatmentsController.create);
router.put('/:id', specializedTreatmentsController.update);
router.delete('/:id', specializedTreatmentsController.delete);

module.exports = router; 