const WebsitePage = require('../models/WebsitePage');
const scraperQueue = require('../queue/scraperQueue');

exports.startScrapingProcess = async (organizationId, websiteUrl) => {
  await scraperQueue.add({
    organizationId,
    url: websiteUrl
  });
};

exports.getScrapingStatus = async (organizationId) => {
  return WebsitePage.find({ organizationId }).select('url status scrapedAt');
};

exports.getPageChunks = async (pageId) => {
  const page = await WebsitePage.findById(pageId);
  return page ? page.chunks : [];
};