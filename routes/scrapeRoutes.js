const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const scrapeController = require('../controllers/scrapeController');

router.get('/status/:orgId', auth, scrapeController.getScrapingStatus);
router.get('/page/:pageId/chunks', auth, scrapeController.getPageChunks);

module.exports = router;