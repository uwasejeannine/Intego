const express = require('express');
const router = express.Router();
const dropoutController = require('../controllers/validations/dropoutController');

router.get('/', dropoutController.getAllDropouts);
router.get('/:id', dropoutController.getDropoutById);
router.post('/', dropoutController.createDropout);
router.put('/:id', dropoutController.updateDropout);
router.delete('/:id', dropoutController.deleteDropout);

module.exports = router; 