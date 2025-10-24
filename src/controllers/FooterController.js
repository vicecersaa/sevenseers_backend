const FooterSection = require('../models/FooterSection');

// GET footer data
exports.getFooter = async (req, res) => {
  try {
    const footer = await FooterSection.findOne();
    const baseUrl = process.env.BASE_URL || "https://sevenseers.id";

    if (!footer) {
      return res.json({
        topFooter: {
          caption: "",
          sites: "",
          phoneNumber: "",
          email: "",
        },
        bottomFooter: {
          logo: "",
          caption: "",
          socialLinks: [],
        },
      });
    }

    // Kalau perlu, tambahkan baseUrl ke path logo dan socialLinks logo
    const bottomLogo = footer.bottomFooter.logo ? `${baseUrl}${footer.bottomFooter.logo}` : "";

    const socialLinks = footer.bottomFooter.socialLinks.map(link => ({
      logo: link.logo ? `${baseUrl}${link.logo}` : "",
      link: link.link,
    }));

    res.json({
      topFooter: footer.topFooter,
      bottomFooter: {
        logo: bottomLogo,
        caption: footer.bottomFooter.caption,
        socialLinks,
      },
    });
  } catch (err) {
    console.error("Get Footer Error:", err);
    res.status(500).json({ message: err.message });
  }
};

// UPDATE footer data
exports.updateFooter = async (req, res) => {
  try {
    const { topFooter, bottomFooter } = req.body;

    let footer = await FooterSection.findOne();
    if (!footer) footer = new FooterSection();

    if (topFooter) {
      footer.topFooter.caption = topFooter.caption || footer.topFooter.caption;
      footer.topFooter.sites = topFooter.sites || footer.topFooter.sites;
      footer.topFooter.phoneNumber = topFooter.phoneNumber || footer.topFooter.phoneNumber;
      footer.topFooter.email = topFooter.email || footer.topFooter.email;
    }

    if (bottomFooter) {
      footer.bottomFooter.logo = bottomFooter.logo
        ? bottomFooter.logo.replace("https://sevenseers.id", "")
        : footer.bottomFooter.logo;
      footer.bottomFooter.caption = bottomFooter.caption || footer.bottomFooter.caption;

      if (bottomFooter.socialLinks) {
        footer.bottomFooter.socialLinks = bottomFooter.socialLinks.map((link) => ({
          logo: link.logo ? link.logo.replace("https://sevenseers.id", "") : "",
          link: link.link || "",
        }));
      }
    }

    await footer.save();

    const baseUrl = process.env.BASE_URL || "https://sevenseers.id";

    res.json({
      topFooter: footer.topFooter,
      bottomFooter: {
        logo: footer.bottomFooter.logo ? `${baseUrl}${footer.bottomFooter.logo}` : "",
        caption: footer.bottomFooter.caption,
        socialLinks: footer.bottomFooter.socialLinks.map(link => ({
          logo: link.logo ? `${baseUrl}${link.logo}` : "",
          link: link.link,
        })),
      },
    });
  } catch (err) {
    console.error("Update Footer Error:", err);
    res.status(500).json({ message: err.message });
  }
};
