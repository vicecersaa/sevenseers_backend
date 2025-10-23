const express = require('express');
const router = express.Router();
const {
  getBrandPartnerSection,
  updateBrandPartnerSection,
} = require('../controllers/BrandPartnerController');

// GET Brand Partner Section data
router.get('/', getBrandPartnerSection);

// UPDATE Brand Partner Section data
router.put('/', updateBrandPartnerSection);

module.exports = router;
