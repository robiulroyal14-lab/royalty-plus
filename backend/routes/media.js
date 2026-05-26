const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { Media } = require('../models/misc');
const { protect, adminOnly } = require('../middleware/auth');

// Storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp|pdf|mp4|mov|avi|svg/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = /image|application\/pdf|video/.test(file.mimetype);
  if (extname && mimetype) return cb(null, true);
  cb(new Error('File type not allowed'));
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB
});

// GET all media
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const { type, limit = 20, page = 1 } = req.query;
    const query = type ? { type } : {};
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [media, total] = await Promise.all([
      Media.find(query).sort('-createdAt').skip(skip).limit(parseInt(limit)),
      Media.countDocuments(query)
    ]);
    res.json({ media, total });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST upload
router.post('/upload', protect, adminOnly, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    
    const baseUrl = process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 5000}`;
    const url = `${baseUrl}/uploads/${req.file.filename}`;
    
    let type = 'other';
    if (req.file.mimetype.startsWith('image/')) type = 'image';
    else if (req.file.mimetype.startsWith('video/')) type = 'video';
    else if (req.file.mimetype === 'application/pdf') type = 'pdf';
    
    const media = await Media.create({
      filename: req.file.filename,
      originalName: req.file.originalname,
      url,
      type,
      mimeType: req.file.mimetype,
      size: req.file.size,
      alt: req.body.alt || req.file.originalname,
      uploadedBy: req.user._id
    });
    
    res.status(201).json(media);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE media
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const media = await Media.findById(req.params.id);
    if (!media) return res.status(404).json({ error: 'Media not found' });
    
    const filePath = path.join(__dirname, '../uploads', media.filename);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    
    await media.deleteOne();
    res.json({ message: 'Media deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
