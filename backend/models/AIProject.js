const mongoose = require('mongoose');

const aiProjectSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, unique: true },
  description: { type: String, required: true },
  shortDescription: String,
  thumbnail: String,
  images: [String],
  videoUrl: String,
  youtubeUrl: String,
  githubUrl: String,
  demoUrl: String,
  researchPdfUrl: String,
  category: {
    type: String,
    enum: ['ai', 'robotics', 'iot', 'machine-learning', 'computer-vision', 'automation', 'nlp', 'other'],
    default: 'ai'
  },
  tags: [String],
  technologies: [String],
  status: { type: String, enum: ['active', 'draft', 'completed', 'archived'], default: 'active' },
  featured: { type: Boolean, default: false },
  views: { type: Number, default: 0 },
  order: { type: Number, default: 0 },
  highlights: [String]
}, { timestamps: true });

aiProjectSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.slug = this.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now();
  }
  next();
});

module.exports = mongoose.model('AIProject', aiProjectSchema);
