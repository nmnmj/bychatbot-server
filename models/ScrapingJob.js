const mongoose = require('mongoose');

const scrapingJobSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { 
    type: String, 
    enum: ['pending', 'processing', 'completed', 'failed'], 
    default: 'pending' 
  },
  pages: [{
    url: String,
    status: String,
    chunks: [String],
    meta: {
      title: String,
      description: String
    }
  }]
}, { timestamps: true });

module.exports = mongoose.model('ScrapingJob', scrapingJobSchema);