const axios = require('axios');
const cheerio = require('cheerio');

exports.fetchMetaDescription = async (url) => {
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    console.log($('meta[name="description"]').attr('content'))
    return $('meta[name="description"]').attr('content') || '';
  } catch (error) {
    console.error('Metadata scraping error:', error);
    return '';
  }
};