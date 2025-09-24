const express = require('express');
const generateController = require('../controllers/generateController');

const router = express.Router();

// POST /api/generate
router.post('/generate', generateController.generateAnswer);

module.exports = router;
