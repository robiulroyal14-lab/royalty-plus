const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  shortDescription: String,
  price: Number,
  currency: { type: String, default: 'USD' },
  images: [String],
  thumbnail: String,
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  tags: [String],
  features: [String],
  specifications: mongoose.Schema.Types.Mixed,
  status: { type: String, enum: ['active', 'draft', 'archived'], default: 'active' },
  featured: { type: Boolean, default: false },
  slug: { type: String, unique: true },
  views: { type: Number, default: 0 },
  order: { type: Number, default: 0 }
}, { timestamps: true });

productSchema.pre('save', function(next) {
  if (this.isModified('title') && !this.slug) {
    this.slug = this.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }
  next();
});

module.exports = mongoose.model('Product', productSchema);
