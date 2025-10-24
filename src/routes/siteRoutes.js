const express = require('express');
const router = express.Router();
const { getMetaByPageId, updateMetaByPageId } = require('../controllers/siteController');

router.get('/meta/', getMetaByPageId);
router.put('/meta/', updateMetaByPageId);

module.exports = router;
