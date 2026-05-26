const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  phone: String,
  subject: String,
  message: { type: String, required: true },
  status: { type: String, enum: ['unread', 'read', 'replied', 'archived'], default: 'unread' },
  ipAddress: String
}, { timestamps: true });

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, unique: true },
  description: String,
  type: {
    type: String,
    enum: ['product', 'article', 'research', 'ai-project', 'general'],
    default: 'general'
  },
  color: { type: String, default: '#1e40af' },
  icon: String,
  order: { type: Number, default: 0 }
}, { timestamps: true });

categorySchema.pre('save', function(next) {
  if (this.isModified('name')) {
    this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }
  next();
});

const mediaSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  originalName: String,
  url: { type: String, required: true },
  type: { type: String, enum: ['image', 'video', 'pdf', 'document', 'other'], default: 'image' },
  mimeType: String,
  size: Number,
  alt: String,
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = {
  Contact: mongoose.model('Contact', contactSchema),
  Category: mongoose.model('Category', categorySchema),
  Media: mongoose.model('Media', mediaSchema)
};
