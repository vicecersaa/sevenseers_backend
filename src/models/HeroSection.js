const mongoose = require('mongoose');

const heroSectionSchema = new mongoose.Schema(
  {
    caption: { type: String, default: "Creative Storytellers. Production Specialists." },
    ctaText: { type: String, default: "KNOW US MORE" },
    ctaLink: { type: String, default: "https://wa.me/6281119738207" },
    videoSrc: { type: String, default: "" },
    logoSrc: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("HeroSection", heroSectionSchema);
