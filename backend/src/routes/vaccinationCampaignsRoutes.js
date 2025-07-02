const express = require('express');
const router = express.Router();
const vaccinationCampaignsController = require('../controllers/validations/vaccinationCampaignsController');

router.get('/', vaccinationCampaignsController.getAll);
router.get('/:id', vaccinationCampaignsController.getById);
router.post('/', vaccinationCampaignsController.create);
router.put('/:id', vaccinationCampaignsController.update);
router.delete('/:id', vaccinationCampaignsController.delete);

module.exports = router; 