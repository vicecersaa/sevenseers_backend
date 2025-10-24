const FooterSection = require('../models/FooterSection');

// ✅ GET Footer Data
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

    // Pastikan path logo & socialLinks jadi full URL
    const bottomLogo = footer.bottomFooter.logo
      ? `${baseUrl}${footer.bottomFooter.logo}`
      : "";

    const socialLinks = footer.bottomFooter.socialLinks.map((link) => ({
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

// ✅ UPDATE Footer Data
exports.updateFooter = async (req, res) => {
  try {
    const { topFooter, bottomFooter } = req.body;
    const baseUrl = process.env.BASE_URL || "https://sevenseers.id";

    let footer = await FooterSection.findOne();
    if (!footer) footer = new FooterSection();

    // --- Top Footer ---
    if (topFooter) {
      footer.topFooter.caption = topFooter.caption || "";
      footer.topFooter.sites = topFooter.sites || "";
      footer.topFooter.phoneNumber = topFooter.phoneNumber || "";
      footer.topFooter.email = topFooter.email || "";
    }

    // --- Bottom Footer ---
    if (bottomFooter) {
      // 🧹 Bersihkan URL penuh jadi path relatif
      let logoPath = bottomFooter.logo || "";
      if (logoPath.startsWith("http")) {
        try {
          const urlObj = new URL(logoPath);
          logoPath = urlObj.pathname; // simpan hanya "/uploads/xxx.jpg"
        } catch (err) {
          console.error("Invalid logo URL:", logoPath);
        }
      }

      footer.bottomFooter.logo = logoPath || footer.bottomFooter.logo;
      footer.bottomFooter.caption = bottomFooter.caption || "";

      // --- Social Links ---
      if (bottomFooter.socialLinks && Array.isArray(bottomFooter.socialLinks)) {
        footer.bottomFooter.socialLinks = bottomFooter.socialLinks.map((link) => {
          let linkLogo = link.logo || "";
          if (linkLogo.startsWith("http")) {
            try {
              const urlObj = new URL(linkLogo);
              linkLogo = urlObj.pathname;
            } catch (err) {
              console.error("Invalid social logo URL:", linkLogo);
            }
          }

          return {
            logo: linkLogo,
            link: link.link || "",
          };
        });
      }
    }

    await footer.save();

    // --- Response ---
    const responseData = {
      topFooter: footer.topFooter,
      bottomFooter: {
        logo: footer.bottomFooter.logo
          ? `${baseUrl}${footer.bottomFooter.logo}`
          : "",
        caption: footer.bottomFooter.caption,
        socialLinks: footer.bottomFooter.socialLinks.map((link) => ({
          logo: link.logo ? `${baseUrl}${link.logo}` : "",
          link: link.link,
        })),
      },
    };

    res.json(responseData);
  } catch (err) {
    console.error("Update Footer Error:", err);
    res.status(500).json({ message: err.message });
  }
};
