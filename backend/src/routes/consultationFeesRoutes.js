const express = require('express');
const router = express.Router();
const consultationFeesController = require('../controllers/validations/consultationFeesController');

router.get('/', consultationFeesController.getAll);
router.get('/:id', consultationFeesController.getById);
router.post('/', consultationFeesController.create);
router.put('/:id', consultationFeesController.update);
router.delete('/:id', consultationFeesController.delete);

module.exports = router; 