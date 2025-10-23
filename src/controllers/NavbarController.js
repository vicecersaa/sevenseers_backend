const NavbarSection = require('../models/NavbarSection');

// ✅ GET navbar data
exports.getNavbar = async (req, res) => {
  try {
    const navbar = await NavbarSection.findOne();
    const baseUrl = process.env.BASE_URL || "http://localhost:5000";

    if (!navbar) {
      return res.json({
        logo: "",
        ctaText: "Get Started",
        ctaLink: "/contact",
      });
    }

    res.json({
      logo: navbar.logo ? `${baseUrl}${navbar.logo}` : "",
      ctaText: navbar.ctaText,
      ctaLink: navbar.ctaLink,
    });
  } catch (err) {
    console.error("Get Navbar Error:", err);
    res.status(500).json({ message: err.message });
  }
};

// ✅ UPDATE navbar data
exports.updateNavbar = async (req, res) => {
  try {
    const { logo, ctaText, ctaLink } = req.body;

    let navbar = await NavbarSection.findOne();
    if (!navbar) navbar = new NavbarSection();

    navbar.logo = logo
      ? logo.replace("http://localhost:5000", "")
      : navbar.logo;

    navbar.ctaText = ctaText || navbar.ctaText;
    navbar.ctaLink = ctaLink || navbar.ctaLink;

    await navbar.save();

    const baseUrl = process.env.BASE_URL || "http://localhost:5000";

    res.json({
      logo: navbar.logo ? `${baseUrl}${navbar.logo}` : "",
      ctaText: navbar.ctaText,
      ctaLink: navbar.ctaLink,
    });
  } catch (err) {
    console.error("Update Navbar Error:", err);
    res.status(500).json({ message: err.message });
  }
};
