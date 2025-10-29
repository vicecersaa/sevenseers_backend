// controllers/navbarController.js
const NavbarSection = require('../models/NavbarSection');

// GET navbar data
exports.getNavbar = async (req, res) => {
  try {
    const navbar = await NavbarSection.findOne();

    if (!navbar) {
      return res.json({
        logo: "",
        ctaText: "Get Started",
        ctaLink: "/contact",
      });
    }

    res.json({
      logo: navbar.logo || "",
      ctaText: navbar.ctaText || "Get Started",
      ctaLink: navbar.ctaLink || "/contact",
    });
  } catch (err) {
    console.error("Get Navbar Error:", err);
    res.status(500).json({ message: err.message });
  }
};

// UPDATE navbar data
exports.updateNavbar = async (req, res) => {
  try {
    const { logo, ctaText, ctaLink } = req.body;

    let navbar = await NavbarSection.findOne();
    if (!navbar) navbar = new NavbarSection();

    // BERSIHKAN LOGO - ambil relative path aja
    if (logo) {
      let cleanLogo = logo;
      
      // 1. Hapus query parameter (?t=xxx) dulu
      cleanLogo = cleanLogo.split('?')[0];
      
      // 2. Jika ada double URL (https://xxx.comhttps://xxx.com), ambil yang terakhir
      const httpsCount = (cleanLogo.match(/https:\/\//g) || []).length;
      if (httpsCount > 1) {
        const lastIndex = cleanLogo.lastIndexOf('https://');
        cleanLogo = cleanLogo.substring(lastIndex);
      }
      
      // 3. Jika masih full URL, extract pathname aja
      if (cleanLogo.startsWith('http://') || cleanLogo.startsWith('https://')) {
        try {
          const url = new URL(cleanLogo);
          cleanLogo = url.pathname; // Ambil /uploads/xxx.png aja
        } catch (e) {
          console.error('URL parsing error:', e);
          // Kalau parsing gagal, coba extract manual
          if (cleanLogo.includes('/uploads/')) {
            const uploadsIndex = cleanLogo.indexOf('/uploads/');
            cleanLogo = cleanLogo.substring(uploadsIndex);
          }
        }
      }
      
      navbar.logo = cleanLogo;
    }
    
    if (ctaText !== undefined) navbar.ctaText = ctaText;
    if (ctaLink !== undefined) navbar.ctaLink = ctaLink;

    await navbar.save();

    res.json({
      logo: navbar.logo || "",
      ctaText: navbar.ctaText,
      ctaLink: navbar.ctaLink,
    });
  } catch (err) {
    console.error("Update Navbar Error:", err);
    res.status(500).json({ message: err.message });
  }
};