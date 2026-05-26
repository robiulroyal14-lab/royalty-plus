// contacts.js
const express = require('express');
const router = express.Router();
const { Contact } = require('../models/misc');
const { protect, adminOnly } = require('../middleware/auth');

router.post('/', async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    if (!name || !email || !message) return res.status(400).json({ error: 'Name, email and message required' });
    const contact = await Contact.create({ name, email, phone, subject, message, ipAddress: req.ip });
    res.status(201).json({ success: true, message: 'Message sent successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const { status, limit = 20, page = 1 } = req.query;
    const query = status ? { status } : {};
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [contacts, total] = await Promise.all([
      Contact.find(query).sort('-createdAt').skip(skip).limit(parseInt(limit)),
      Contact.countDocuments(query)
    ]);
    res.json({ contacts, total });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.patch('/:id/status', protect, adminOnly, async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    res.json(contact);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.json({ message: 'Contact deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
