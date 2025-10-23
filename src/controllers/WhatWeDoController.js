const WhatWeDoSection = require("../models/WhatWeDoSection");

// ✅ GET What We Do Section
exports.getWhatWeDoSection = async (req, res) => {
  try {
    const section = await WhatWeDoSection.findOne();

    if (!section) {
      return res.json({
        title: "What We Do",
        caption: "Our amazing services",
        ball1: "Service 1",
        ball2: "Service 2",
        ball3: "Service 3",
      });
    }

    res.json({
      title: section.title || "What We Do",
      caption: section.caption || "Our amazing services",
      ball1: section.ball1 || "Service 1",
      ball2: section.ball2 || "Service 2",
      ball3: section.ball3 || "Service 3",
    });
  } catch (err) {
    console.error("Get WhatWeDoSection Error:", err);
    res.status(500).json({ message: err.message });
  }
};

// ✅ UPDATE What We Do Section
exports.updateWhatWeDoSection = async (req, res) => {
  try {
    const { title, caption, ball1, ball2, ball3 } = req.body;

    let section = await WhatWeDoSection.findOne();
    if (!section) section = new WhatWeDoSection();

    // Update fields if provided
    if (title !== undefined) section.title = title;
    if (caption !== undefined) section.caption = caption;
    if (ball1 !== undefined) section.ball1 = ball1;
    if (ball2 !== undefined) section.ball2 = ball2;
    if (ball3 !== undefined) section.ball3 = ball3;

    await section.save();

    res.json({
      title: section.title,
      caption: section.caption,
      ball1: section.ball1,
      ball2: section.ball2,
      ball3: section.ball3,
    });
  } catch (err) {
    console.error("Update WhatWeDoSection Error:", err);
    res.status(500).json({ message: err.message });
  }
};
