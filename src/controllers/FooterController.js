const FooterSection = require('../models/FooterSection');

// GET footer data
exports.getFooter = async (req, res) => {
  try {
    const footer = await FooterSection.findOne();

    if (!footer) {
      return res.json({
        topFooter: { caption: "", sites: "", phoneNumber: "", email: "" },
        bottomFooter: { logo: "", caption: "", socialLinks: [] },
      });
    }

    res.json({
      topFooter: footer.topFooter,
      bottomFooter: footer.bottomFooter,
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
      footer.topFooter = { ...footer.topFooter, ...topFooter };
    }

    if (bottomFooter) {
      footer.bottomFooter = { ...footer.bottomFooter, ...bottomFooter };
    }

    await footer.save();

    res.json({
      topFooter: footer.topFooter,
      bottomFooter: footer.bottomFooter,
    });
  } catch (err) {
    console.error("Update Footer Error:", err);
    res.status(500).json({ message: err.message });
  }
};
