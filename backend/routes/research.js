const express = require('express');
const router = express.Router();
const Research = require('../models/Research');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const { category, status = 'published', featured, limit = 10, page = 1, search } = req.query;
    const query = { status };
    if (category) query.category = category;
    if (featured) query.featured = featured === 'true';
    if (search) query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { abstract: { $regex: search, $options: 'i' } }
    ];
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [items, total] = await Promise.all([
      Research.find(query).populate('category', 'name slug').sort('-createdAt').skip(skip).limit(parseInt(limit)),
      Research.countDocuments(query)
    ]);
    res.json({ research: items, total, pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:slug', async (req, res) => {
  try {
    const item = await Research.findOne({ slug: req.params.slug }).populate('category', 'name slug');
    if (!item) return res.status(404).json({ error: 'Research not found' });
    item.views += 1;
    await item.save();
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/:id/download', async (req, res) => {
  try {
    await Research.findByIdAndUpdate(req.params.id, { $inc: { downloads: 1 } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const item = await Research.create(req.body);
    res.status(201).json(item);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const item = await Research.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) return res.status(404).json({ error: 'Research not found' });
    res.json(item);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Research.findByIdAndDelete(req.params.id);
    res.json({ message: 'Research deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
