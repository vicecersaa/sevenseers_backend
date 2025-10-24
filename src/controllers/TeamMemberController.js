const TeamMemberSection = require('../models/TeamMemberSection');

// ✅ GET Team Member Section
exports.getTeamMemberSection = async (req, res) => {
  try {
    const section = await TeamMemberSection.findOne();

    if (!section) {
      return res.json({
        title: "Our Team",
        caption: "",
        members: [],
      });
    }

    // Langsung kirim data dari DB apa adanya (tanpa baseUrl)
    res.json({
      title: section.title,
      caption: section.caption,
      members: section.members || [],
    });
  } catch (err) {
    console.error("Get TeamMemberSection Error:", err);
    res.status(500).json({ message: err.message });
  }
};

// ✅ UPDATE Team Member Section
exports.updateTeamMemberSection = async (req, res) => {
  try {
    const { title, caption, members } = req.body;

    let section = await TeamMemberSection.findOne();
    if (!section) section = new TeamMemberSection();

    section.title = title || section.title;
    section.caption = caption || section.caption;

    if (members && Array.isArray(members)) {
      section.members = members.map((m) => ({
        name: m.name || "",
        role: m.role || "",
        photo: m.photo || "", // simpan full URL langsung dari frontend
      }));
    }

    await section.save();

    // Langsung kirim data yang baru disimpan
    res.json({
      title: section.title,
      caption: section.caption,
      members: section.members,
    });
  } catch (err) {
    console.error("Update TeamMemberSection Error:", err);
    res.status(500).json({ message: err.message });
  }
};
