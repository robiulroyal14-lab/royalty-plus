// articles.js
const express = require('express');
const router = express.Router();
const Article = require('../models/Article');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const { category, status = 'published', featured, limit = 10, page = 1, search } = req.query;
    const query = { status };
    if (category) query.category = category;
    if (featured) query.featured = featured === 'true';
    if (search) query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { excerpt: { $regex: search, $options: 'i' } },
      { tags: { $in: [new RegExp(search, 'i')] } }
    ];
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [articles, total] = await Promise.all([
      Article.find(query).populate('category', 'name slug').sort('-publishedAt').skip(skip).limit(parseInt(limit)),
      Article.countDocuments(query)
    ]);
    res.json({ articles, total, pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/admin/all', protect, adminOnly, async (req, res) => {
  try {
    const articles = await Article.find({}).populate('category', 'name').sort('-createdAt');
    res.json(articles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:slug', async (req, res) => {
  try {
    const article = await Article.findOne({ slug: req.params.slug }).populate('category', 'name slug');
    if (!article) return res.status(404).json({ error: 'Article not found' });
    article.views += 1;
    await article.save();
    res.json(article);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const article = await Article.create(req.body);
    res.status(201).json(article);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const article = await Article.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!article) return res.status(404).json({ error: 'Article not found' });
    res.json(article);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Article.findByIdAndDelete(req.params.id);
    res.json({ message: 'Article deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
