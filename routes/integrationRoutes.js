const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const integrationController = require('../controllers/integrationController');

router.post('/send-instructions', auth, integrationController.sendIntegrationEmail);
router.get('/check-integration', auth, integrationController.checkIntegration);

module.exports = router;