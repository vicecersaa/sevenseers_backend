const MainSection = require('../models/MainSection');

// ✅ GET main section
exports.getMainSection = async (req, res) => {
  try {
    const main = await MainSection.findOne();
    const baseUrl = process.env.BASE_URL || "http://localhost:5000";

    if (!main) {
      return res.json({
        videoSrc: "",
        title: "Your Main Title Here",
      });
    }

    res.json({
      videoSrc: main.videoSrc ? `${baseUrl}${main.videoSrc}` : "",
      title: main.title || "Your Main Title Here",
    });
  } catch (err) {
    console.error("Get MainSection Error:", err);
    res.status(500).json({ message: err.message });
  }
};

// ✅ UPDATE main section
exports.updateMainSection = async (req, res) => {
  try {
    const { title, videoSrc } = req.body;

    let main = await MainSection.findOne();
    if (!main) main = new MainSection();

    // Update fields
    main.title = title || main.title;
    main.videoSrc = videoSrc
      ? videoSrc.replace("http://localhost:5000", "")
      : main.videoSrc;

    await main.save();

    const baseUrl = process.env.BASE_URL || "http://localhost:5000";

    res.json({
      videoSrc: main.videoSrc ? `${baseUrl}${main.videoSrc}` : "",
      title: main.title,
    });
  } catch (err) {
    console.error("Update MainSection Error:", err);
    res.status(500).json({ message: err.message });
  }
};
