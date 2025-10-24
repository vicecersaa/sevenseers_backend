const SiteMeta = require('../models/SiteMeta');

// GET meta homepage
exports.getMeta = async (req, res) => {
  try {
    let meta = await SiteMeta.findOne(); // ambil dokumen pertama
    if (!meta) {
      meta = new SiteMeta({
        title: "",
        description: "",
        favicon: "",
        author: "",
        keywords: "",
      });
      await meta.save();
    }
    res.json(meta);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE meta homepage
exports.updateMeta = async (req, res) => {
  try {
    let meta = await SiteMeta.findOne(); // ambil dokumen pertama
    if (!meta) {
      meta = new SiteMeta(req.body);
    } else {
      Object.assign(meta, req.body);
      meta.updatedAt = new Date();
    }
    await meta.save();
    res.json({ message: "Meta updated", meta });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
