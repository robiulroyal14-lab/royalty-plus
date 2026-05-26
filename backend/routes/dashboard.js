const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Article = require('../models/Article');
const Research = require('../models/Research');
const AIProject = require('../models/AIProject');
const { Contact } = require('../models/misc');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/stats', protect, adminOnly, async (req, res) => {
  try {
    const [
      totalProducts, activeProducts,
      totalArticles, publishedArticles,
      totalResearch, publishedResearch,
      totalProjects, activeProjects,
      totalContacts, unreadContacts,
      recentContacts, recentArticles
    ] = await Promise.all([
      Product.countDocuments(),
      Product.countDocuments({ status: 'active' }),
      Article.countDocuments(),
      Article.countDocuments({ status: 'published' }),
      Research.countDocuments(),
      Research.countDocuments({ status: 'published' }),
      AIProject.countDocuments(),
      AIProject.countDocuments({ status: 'active' }),
      Contact.countDocuments(),
      Contact.countDocuments({ status: 'unread' }),
      Contact.find({ status: 'unread' }).sort('-createdAt').limit(5),
      Article.find({ status: 'published' }).sort('-publishedAt').limit(5).select('title publishedAt views')
    ]);
    
    res.json({
      products: { total: totalProducts, active: activeProducts },
      articles: { total: totalArticles, published: publishedArticles },
      research: { total: totalResearch, published: publishedResearch },
      aiProjects: { total: totalProjects, active: activeProjects },
      contacts: { total: totalContacts, unread: unreadContacts },
      recent: { contacts: recentContacts, articles: recentArticles }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
