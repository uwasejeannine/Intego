const express = require('express');
const router = express.Router();
const SeedsController = require('../controllers/validations/seedsController');

router.get('/', SeedsController.getAll);
router.get('/:id', SeedsController.getById);
router.post('/', SeedsController.create);
router.put('/:id', SeedsController.update);
router.delete('/:id', SeedsController.delete);

module.exports = router; 