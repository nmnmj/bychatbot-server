const mongoose = require('mongoose');

const websitePageSchema = new mongoose.Schema({
  organizationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: true },
  url: { type: String, required: true },
  status: { type: String, enum: ['pending', 'scraped'], default: 'pending' },
  chunks: [{ type: String }],
  scrapedAt: { type: Date }
});

module.exports = mongoose.model('WebsitePage', websitePageSchema);