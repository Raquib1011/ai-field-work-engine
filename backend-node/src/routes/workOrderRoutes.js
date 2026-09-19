const express = require('express');
const router = express.Router();
const workOrderController = require('../controllers/workOrderController');

router.get('/', workOrderController.getWorkOrders);
router.patch('/:id/assign', workOrderController.assignTechnician);
router.put('/:id/assign', workOrderController.assignTechnician);

module.exports = router;