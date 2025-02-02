const Queue = require('bull');
require('dotenv').config();
const { scrapeWebsite } = require('../services/scrapingService');
const WebsitePage = require('../models/WebsitePage');
(async () => {
  const fetch = (await import("node-fetch")).default;

  // Use fetch here
})();
const cheerio = require("cheerio");
const url = require("url");
const { default: axios } = require('axios');

const scraperQueue = new Queue('website-scraping', {
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT
  }
});

scraperQueue.process(async (job) => {
  const { organizationId, url } = job.data;
  console.log("process")
  // Discover pages first
  const pagesToScrape = await discoverPages(url);

  console.log("pagesToScrape")
  console.log(pagesToScrape)
  
  const pagePromises = pagesToScrape.map(async (pageUrl) => {
    // const page = new WebsitePage({ organizationId, url: pageUrl, status: 'pending' });
    // await page.save();
    // return page;
    return pageUrl;
  });

  const pages = await Promise.all(pagePromises);

  // console.log("pages")
  // console.log(pages)

  // Process scraping after discovering pages
  for (const page of pages) {
    try {
      const content = await scrapePageContent(page.url);
      page.chunks = chunkContent(content);
      page.status = 'scraped';
      page.scrapedAt = new Date();
      // await page.save();
    } catch (error) {
      console.error(`Failed to scrape ${page.url}:`, error);
    }
  }
});

async function fetchHTML(pageUrl) {
  try {
    const response = await fetch(pageUrl);
    if (!response.ok) throw new Error(`Failed to fetch: ${pageUrl}`);
    return await response.text();
  } catch (error) {
    console.error(error);
    return null;
  }
}

// Helper functions (simulated)
async function discoverPages(baseUrl, maxDepth = 2) {
  const visited = new Set();
  const toVisit = [baseUrl];
  let depth = 0;
  
  while (depth < maxDepth) {
    const nextBatch = [...toVisit];
    toVisit.length = 0; // Clear the queue for the next depth level
    for (const nextVisit of nextBatch) {
      if (visited.has(nextVisit)) continue;
      console.log(`Crawling: ${nextVisit}`);
      const html = await fetchHTML(nextVisit);
      if (!html) continue;
      
      visited.add(nextVisit);
      const $ = cheerio.load(html);
      $("a").each((_, element) => {
        let link = $(element).attr("href");
        if (link) {
          link = url.resolve(baseUrl, link).split("#")[0];
          if (!visited.has(link) && link.startsWith(baseUrl)) {
            toVisit.push(link);
          }
        }
      });
    }
    depth++;
  }
  return Array.from(visited);
}

async function scrapePageContent(url) {
  const response = await axios.get(url);
  return response.data; // Simplified content extraction
}

function chunkContent(content) {
  // Simple content chunking logic
  return [content.substring(0, 1000), content.substring(1000, 2000)];
}

module.exports = scraperQueue;