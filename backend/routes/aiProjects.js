const express = require('express');
const router = express.Router();
const AIProject = require('../models/AIProject');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const { category, status = 'active', featured, limit = 12, page = 1, search } = req.query;
    const query = {};
    if (status !== 'all') query.status = status;
    if (category) query.category = category;
    if (featured) query.featured = featured === 'true';
    if (search) query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { tags: { $in: [new RegExp(search, 'i')] } }
    ];
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [projects, total] = await Promise.all([
      AIProject.find(query).sort('order -createdAt').skip(skip).limit(parseInt(limit)),
      AIProject.countDocuments(query)
    ]);
    res.json({ projects, total, pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:slug', async (req, res) => {
  try {
    const project = await AIProject.findOne({ slug: req.params.slug });
    if (!project) return res.status(404).json({ error: 'Project not found' });
    project.views += 1;
    await project.save();
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const project = await AIProject.create(req.body);
    res.status(201).json(project);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const project = await AIProject.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.json(project);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await AIProject.findByIdAndDelete(req.params.id);
    res.json({ message: 'Project deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
