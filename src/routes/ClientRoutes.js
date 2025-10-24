const express = require('express');
const router = express.Router();
const { getClientSection, updateClientSection } = require('../controllers/ClientController');

// GET client section data
router.get('/', getClientSection);

// UPDATE client section data
router.post('/', updateClientSection);

module.exports = router;
