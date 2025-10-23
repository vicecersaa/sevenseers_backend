const express = require('express');
const router = express.Router();
const { getNavbar, updateNavbar } = require('../controllers/NavbarController');

// GET navbar data
router.get('/', getNavbar);

// UPDATE navbar data
router.put('/', updateNavbar);

module.exports = router;
