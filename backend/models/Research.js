const mongoose = require('mongoose');

const researchSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, unique: true },
  abstract: { type: String, required: true },
  content: String,
  authors: [String],
  pdfUrl: String,
  thumbnail: String,
  images: [String],
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  tags: [String],
  status: { type: String, enum: ['published', 'draft'], default: 'draft' },
  featured: { type: Boolean, default: false },
  downloads: { type: Number, default: 0 },
  views: { type: Number, default: 0 },
  publishedDate: Date,
  journal: String,
  doi: String
}, { timestamps: true });

researchSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.slug = this.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now();
  }
  next();
});

module.exports = mongoose.model('Research', researchSchema);
