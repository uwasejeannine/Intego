const express = require('express');
const router = express.Router();
const performanceController = require('../controllers/validations/performanceController');

router.get('/', performanceController.getAllPerformances);
router.get('/:id', performanceController.getPerformanceById);
router.post('/', performanceController.createPerformance);
router.put('/:id', performanceController.updatePerformance);
router.delete('/:id', performanceController.deletePerformance);

module.exports = router; 