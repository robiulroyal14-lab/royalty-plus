const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, unique: true },
  content: { type: String, required: true },
  excerpt: String,
  featuredImage: String,
  author: { type: String, default: 'Royalty Plus Team' },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  tags: [String],
  status: { type: String, enum: ['published', 'draft', 'archived'], default: 'draft' },
  featured: { type: Boolean, default: false },
  views: { type: Number, default: 0 },
  readTime: Number,
  seo: {
    metaTitle: String,
    metaDescription: String,
    keywords: [String]
  },
  publishedAt: Date
}, { timestamps: true });

articleSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.slug = this.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now();
  }
  if (this.isModified('content')) {
    const wordCount = this.content.split(/\s+/).length;
    this.readTime = Math.ceil(wordCount / 200);
  }
  if (this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  next();
});

module.exports = mongoose.model('Article', articleSchema);
