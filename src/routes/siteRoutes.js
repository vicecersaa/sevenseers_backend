const express = require('express');
const router = express.Router();
const { getMetaByPageId, updateMetaByPageId } = require('../controllers/siteController');

router.get('/meta/:pageId', getMetaByPageId);
router.put('/meta/:pageId', updateMetaByPageId);

module.exports = router;
