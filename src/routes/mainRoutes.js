const express = require('express');
const router = express.Router();
const { getMainSection, updateMainSection } = require('../controllers/mainController');

// GET main section data
router.get('/', getMainSection);

// UPDATE main section data
router.put('/', updateMainSection);

module.exports = router;
