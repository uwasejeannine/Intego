const express = require('express');
const router = express.Router();
const LocationController = require('../controllers/validations/locationController');

// Get all districts
router.get('/districts', LocationController.getDistricts);

// Get all sectors
router.get('/sectors', LocationController.getSectors);

// Get sectors by district
router.get('/districts/:districtId/sectors', LocationController.getSectorsByDistrict);

module.exports = router; 