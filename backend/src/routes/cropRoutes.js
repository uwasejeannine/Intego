const express = require('express');
const { CropController } = require('../controllers/validations/cropController');

const router = express.Router();

// Basic CRUD operations
router.get('/', CropController.getAllCrops);
router.get('/stats', CropController.getCropStats);
router.get('/recommendations', CropController.getCropRecommendations);
router.get('/filters', CropController.getCropFilters);
router.get('/current-season', CropController.getCurrentSeasonCrops);
router.get('/:id', CropController.getCropById);
router.post('/', CropController.createCrop);
router.put('/:id', CropController.updateCrop);
router.delete('/:id', CropController.deleteCrop);

module.exports = router;