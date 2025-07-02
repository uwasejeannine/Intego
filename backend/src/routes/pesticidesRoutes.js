const express = require('express');
const router = express.Router();
const PesticidesController = require('../controllers/validations/pesticidesController');

router.get('/', PesticidesController.getAll);
router.get('/:id', PesticidesController.getById);
router.post('/', PesticidesController.create);
router.put('/:id', PesticidesController.update);
router.delete('/:id', PesticidesController.delete);

module.exports = router; 