const express = require('express');
const router = express.Router();
const { getMeta, updateMeta } = require('../controllers/siteController');

router.get('/meta', getMeta);
router.put('/meta', updateMeta);

module.exports = router;
