const express = require('express');
const router = express.Router();
const { getFooter, updateFooter } = require('../controllers/FooterController');

router.get('/', getFooter);
router.put('/', updateFooter);

module.exports = router;
