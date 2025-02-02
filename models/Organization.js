const mongoose = require('mongoose');

const organizationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  companyName: { type: String, required: true },
  websiteUrl: { type: String, required: true },
  description: { type: String },
  websitePages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'WebsitePage' }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Organization', organizationSchema);