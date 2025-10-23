const mongoose = require('mongoose');
const SiteMetaSchema = new mongoose.Schema({
  pageId: { type: String, required: true, unique: true }, // misal: 'homepage', 'about', 'contact', dsb
  title: { type: String, default: "My Website" },
  description: { type: String, default: "Website description" },
  favicon: { type: String },
  author: { type: String },
  keywords: { type: String },
  updatedAt: { type: Date, default: Date.now }
});


module.exports = mongoose.model('SiteMeta', SiteMetaSchema);
