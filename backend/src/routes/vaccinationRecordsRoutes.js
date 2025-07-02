const express = require('express');
const router = express.Router();
const vaccinationRecordsController = require('../controllers/validations/vaccinationRecordsController');

router.get('/', vaccinationRecordsController.getAll);
router.get('/:id', vaccinationRecordsController.getById);
router.post('/', vaccinationRecordsController.create);
router.put('/:id', vaccinationRecordsController.update);
router.delete('/:id', vaccinationRecordsController.delete);

module.exports = router; 