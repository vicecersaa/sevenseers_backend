const HeroSection = require('../models/HeroSection');

// Helper: bikin path relatif dari URL
const toRelativePath = (url) => {
  if (!url) return "";
  try {
    const u = new URL(url);
    return u.pathname; // ambil path saja
  } catch (err) {
    return url; // kalau bukan URL valid, simpan apa adanya
  }
};

// ✅ GET hero section
exports.getHeroSection = async (req, res) => {
  try {
    const hero = await HeroSection.findOne();
    const baseUrl = process.env.BASE_URL || "https://sevenseers.id";

    if (!hero) {
      return res.json({
        videoSrc: "",
        logoSrc: `${baseUrl}/uploads/logo.png`,
        caption: "Creative Storytellers. Production Specialists.",
        ctaText: "KNOW US MORE",
        ctaLink: "https://wa.me/6281119738207",
      });
    }

    res.json({
      videoSrc: hero.videoSrc ? `${baseUrl}${hero.videoSrc}` : "",
      logoSrc: hero.logoSrc ? `${baseUrl}${hero.logoSrc}` : `${baseUrl}/uploads/logo.png`,
      caption: hero.caption || "Creative Storytellers. Production Specialists.",
      ctaText: hero.ctaText || "KNOW US MORE",
      ctaLink: hero.ctaLink || "https://wa.me/6281119738207",
    });
  } catch (err) {
    console.error("Get HeroSection Error:", err);
    res.status(500).json({ message: err.message });
  }
};

// ✅ UPDATE hero section
exports.updateHeroSection = async (req, res) => {
  try {
    const { caption, ctaText, ctaLink, videoSrc, logoSrc } = req.body;

    let hero = await HeroSection.findOne();
    if (!hero) hero = new HeroSection();

    const baseUrl = process.env.BASE_URL || "https://sevenseers.id";

    // Update fields
    hero.caption = caption || hero.caption;
    hero.ctaText = ctaText || hero.ctaText;
    hero.ctaLink = ctaLink || hero.ctaLink;
    hero.videoSrc = videoSrc ? toRelativePath(videoSrc) : hero.videoSrc;
    hero.logoSrc = logoSrc ? toRelativePath(logoSrc) : hero.logoSrc;

    await hero.save();

    res.json({
      videoSrc: hero.videoSrc ? `${baseUrl}${hero.videoSrc}` : "",
      logoSrc: hero.logoSrc ? `${baseUrl}${hero.logoSrc}` : `${baseUrl}/uploads/logo.png`,
      caption: hero.caption,
      ctaText: hero.ctaText,
      ctaLink: hero.ctaLink,
    });
  } catch (err) {
    console.error("Update HeroSection Error:", err);
    res.status(500).json({ message: err.message });
  }
};
