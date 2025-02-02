const Organization = require('../models/Organization');
const { sendIntegrationInstructions } = require('../services/emailService');

exports.sendIntegrationEmail = async (req, res) => {
  try {
    const { email } = req.body;
    const integrationCode = `<script src="${process.env.CHATBOT_CDN_URL}"></script>`;
    
    await sendIntegrationInstructions(email, integrationCode);
    res.json({ message: 'Integration instructions sent' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send instructions' });
  }
};

exports.checkIntegration = async (req, res) => {
  try {
    // Simulated integration check
    const isIntegrated = Math.random() > 0.5; // Replace with actual check
    res.json({ isIntegrated });
  } catch (error) {
    res.status(500).json({ error: 'Integration check failed' });
  }
};