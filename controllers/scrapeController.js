const { getScrapingStatus, getPageChunks } = require('../services/scrapingService');

exports.getScrapingStatus = async (req, res) => {
  try {
    const organizationId = req.params.orgId;
    const status = await getScrapingStatus(organizationId);
    res.json(status);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get scraping status' });
  }
};

exports.getPageChunks = async (req, res) => {
  try {
    const pageId = req.params.pageId;
    const chunks = await getPageChunks(pageId);
    res.json(chunks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get page chunks' });
  }
};