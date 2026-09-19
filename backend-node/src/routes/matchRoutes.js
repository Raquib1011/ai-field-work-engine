const express = require('express');
const router = express.Router();
const matchController = require('../controllers/matchController');

router.post('/evaluate', matchController.evaluateMatch);

module.exports = router;