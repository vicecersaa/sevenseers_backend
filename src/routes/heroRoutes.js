const express = require('express');
const router = express.Router();
const { getHeroSection, updateHeroSection } = require('../controllers/heroController');

// GET hero data
router.get('/', getHeroSection);

// UPDATE hero data
router.put('/', updateHeroSection);

module.exports = router;
