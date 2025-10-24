const NavbarSection = require('../models/NavbarSection');

// GET navbar data
exports.getNavbar = async (req, res) => {
  try {
    const navbar = await NavbarSection.findOne();
    const baseUrl = process.env.BASE_URL || "https://sevenseers.id";

    if (!navbar) {
      return res.json({
        logo: "",
        ctaText: "Get Started",
        ctaLink: "/contact",
      });
    }

    // Jika logo sudah diawali http, jangan tambah baseUrl lagi
    let logo = navbar.logo || "";
    if (logo && !logo.startsWith("http")) {
      logo = `${baseUrl}${logo}`;
    }

    res.json({
      logo,
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

    // Selalu simpan apa adanya (relative path atau full URL)
    navbar.logo = logo || navbar.logo;
    navbar.ctaText = ctaText || navbar.ctaText;
    navbar.ctaLink = ctaLink || navbar.ctaLink;

    await navbar.save();

    const baseUrl = process.env.BASE_URL || "https://sevenseers.id";
    let logoPath = navbar.logo || "";
    if (logoPath && !logoPath.startsWith("http")) {
      logoPath = `${baseUrl}${logoPath}`;
    }

    res.json({
      logo: logoPath,
      ctaText: navbar.ctaText,
      ctaLink: navbar.ctaLink,
    });
  } catch (err) {
    console.error("Update Navbar Error:", err);
    res.status(500).json({ message: err.message });
  }
};
