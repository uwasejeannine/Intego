const express = require('express');
const router = express.Router();
const infrastructureController = require('../controllers/validations/infrastructureController');

router.get('/', infrastructureController.getAllInfrastructures);
router.get('/:id', infrastructureController.getInfrastructureById);
router.post('/', infrastructureController.createInfrastructure);
router.put('/:id', infrastructureController.updateInfrastructure);
router.delete('/:id', infrastructureController.deleteInfrastructure);

module.exports = router; 