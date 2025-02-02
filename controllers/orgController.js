const Organization = require('../models/Organization');
const { startScrapingProcess } = require('../services/scrapingService');
const { fetchMetaDescription } = require('../utils/metadataScraper');

exports.createOrganization = async (req, res) => {
  try {
    const { companyName, websiteUrl, description } = req.body;
    // const userId = req.user.userId;

    if (!websiteUrl || !websiteUrl.startsWith("http")) {
      return res.status(400).json({ error: "Invalid website URL" });
    }
    // Auto-fetch description if not provided
    let finalDescription = description;
    if (!finalDescription) {
      finalDescription = await fetchMetaDescription(websiteUrl);
    }
    console.log("finalDescription")
    console.log(finalDescription)
    // const org = new Organization({
    //   userId,
    //   companyName,
    //   websiteUrl,
    //   description: finalDescription
    // });
    
    // await org.save();
    
    // Start background scraping process
    // await startScrapingProcess(org._id=1, websiteUrl);
    await startScrapingProcess(1, websiteUrl);
    
    res.status(201).json(org);
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Organization creation failed' });
  }
};