const SiteMeta = require('../models/SiteMeta');

exports.getMetaByPageId = async (req, res) => {
  const { pageId } = req.params;
  try {
    let meta = await SiteMeta.findOne({ pageId });
    if (!meta) {
      // Kalau belum ada, return default kosong
      meta = {
        title: "",
        description: "",
        favicon: "",
        author: "",
        keywords: "",
      };
    }
    res.json(meta);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateMetaByPageId = async (req, res) => {
  const { pageId } = req.params;
  try {
    let meta = await SiteMeta.findOne({ pageId });
    if (!meta) {
      meta = new SiteMeta({ pageId, ...req.body });
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
