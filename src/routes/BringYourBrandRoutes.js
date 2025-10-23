// src/routes/BringYourBrandRoutes.js
const express = require('express');
const router = express.Router();

// Import controller dengan nama yang sesuai
const {
  getBringYourBrandSection,
  updateBringYourBrandSection,
} = require('../controllers/BringYourBrandController');

// GET Bring Your Brand Section data
router.get('/', getBringYourBrandSection);

// UPDATE Bring Your Brand Section data
router.put('/', updateBringYourBrandSection);

module.exports = router;
