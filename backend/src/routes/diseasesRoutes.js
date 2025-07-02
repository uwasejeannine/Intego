const express = require('express');
const router = express.Router();
const diseasesController = require('../controllers/validations/diseasesController');

router.get('/', diseasesController.getAll);
router.get('/:id', diseasesController.getById);
router.post('/', diseasesController.create);
router.put('/:id', diseasesController.update);
router.delete('/:id', diseasesController.delete);

module.exports = router; 