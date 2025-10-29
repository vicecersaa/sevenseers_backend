// controllers/navbarController.js
const NavbarSection = require('../models/NavbarSection');

// 🟢 GET navbar data
exports.getNavbar = async (req, res) => {
  try {
    const navbar = await NavbarSection.findOne();

    if (!navbar) {
      return res.json({
        logo: "",
        ctaText: "Get Started",
        ctaLink: "/contact",
        menuItems: [], // default kosong
      });
    }

    // Urutkan menu berdasarkan "order"
    const sortedMenu = (navbar.menuItems || []).sort((a, b) => a.order - b.order);

    res.json({
      logo: navbar.logo || "",
      ctaText: navbar.ctaText || "Get Started",
      ctaLink: navbar.ctaLink || "/contact",
      menuItems: sortedMenu,
    });
  } catch (err) {
    console.error("Get Navbar Error:", err);
    res.status(500).json({ message: err.message });
  }
};

// 🟡 UPDATE navbar data
exports.updateNavbar = async (req, res) => {
  try {
    const { logo, ctaText, ctaLink, menuItems } = req.body;

    let navbar = await NavbarSection.findOne();
    if (!navbar) navbar = new NavbarSection();

    // BERSIHKAN LOGO - ambil relative path aja
    if (logo) {
      let cleanLogo = logo;

      // 1️⃣ Hapus query parameter (?t=xxx)
      cleanLogo = cleanLogo.split('?')[0];

      // 2️⃣ Kalau ada double URL (https://xxx.comhttps://xxx.com), ambil terakhir
      const httpsCount = (cleanLogo.match(/https:\/\//g) || []).length;
      if (httpsCount > 1) {
        const lastIndex = cleanLogo.lastIndexOf('https://');
        cleanLogo = cleanLogo.substring(lastIndex);
      }

      // 3️⃣ Ambil path aja (/uploads/xxx.png)
      if (cleanLogo.startsWith('http://') || cleanLogo.startsWith('https://')) {
        try {
          const url = new URL(cleanLogo);
          cleanLogo = url.pathname;
        } catch (e) {
          console.error('URL parsing error:', e);
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

    // 🔥 Tambahan: update menuItems kalau dikirim dari frontend
    if (Array.isArray(menuItems)) {
      navbar.menuItems = menuItems.map((item, index) => ({
        title: item.title?.trim() || "",
        link: item.link?.trim() || "#",
        order: item.order ?? index, // fallback ke urutan index
      }));
    }

    await navbar.save();

    res.json({
      logo: navbar.logo || "",
      ctaText: navbar.ctaText,
      ctaLink: navbar.ctaLink,
      menuItems: navbar.menuItems.sort((a, b) => a.order - b.order),
    });
  } catch (err) {
    console.error("Update Navbar Error:", err);
    res.status(500).json({ message: err.message });
  }
};
