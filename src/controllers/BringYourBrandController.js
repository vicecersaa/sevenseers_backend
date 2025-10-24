// src/controllers/BringYourBrandController.js
const BringYourBrandSection = require('../models/BringYourBrandSection');

exports.getBringYourBrandSection = async (req, res) => {
  try {
    const section = await BringYourBrandSection.findOne();

    if (!section) {
      return res.json({
        backgroundImage: '',
        title: 'Your Bring Your Brand Title',
        ctaText: 'Connect Now',
        ctaLink: 'https://wa.me/1234567890',
      });
    }

    // Langsung kirim apa adanya tanpa prefix baseUrl
    res.json({
      backgroundImage: section.backgroundImage || '',
      title: section.title,
      ctaText: section.ctaText,
      ctaLink: section.ctaLink,
    });
  } catch (err) {
    console.error('Get BringYourBrandSection Error:', err);
    res.status(500).json({ message: err.message });
  }
};

exports.updateBringYourBrandSection = async (req, res) => {
  try {
    const { backgroundImage, title, ctaText, ctaLink } = req.body;

    let section = await BringYourBrandSection.findOne();
    if (!section) section = new BringYourBrandSection();

    // Simpan langsung full URL tanpa nambah prefix
    section.backgroundImage = backgroundImage || section.backgroundImage;
    section.title = title || section.title;
    section.ctaText = ctaText || section.ctaText;
    section.ctaLink = ctaLink || section.ctaLink;

    await section.save();

    // Kirim balik data tanpa baseUrl
    res.json({
      backgroundImage: section.backgroundImage || '',
      title: section.title,
      ctaText: section.ctaText,
      ctaLink: section.ctaLink,
    });
  } catch (err) {
    console.error('Update BringYourBrandSection Error:', err);
    res.status(500).json({ message: err.message });
  }
};
