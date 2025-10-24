const TeamMemberSection = require('../models/TeamMemberSection');

// ✅ GET Team Member Section
exports.getTeamMemberSection = async (req, res) => {
  try {
    const section = await TeamMemberSection.findOne();
    const baseUrl = process.env.BASE_URL || "https://sevenseers.id";

    if (!section) {
      return res.json({
        title: "Our Team",
        caption: "",
        members: [],
      });
    }

    // Tambahkan baseUrl ke photo jika ada
    const membersWithFullPath = section.members.map((m) => ({
      name: m.name,
      role: m.role,
      photo: m.photo ? `${baseUrl}${m.photo}` : "",
    }));

    res.json({
      title: section.title,
      caption: section.caption,
      members: membersWithFullPath,
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
      section.members = members.map((m) => {
        let photoPath = m.photo || "";

        // Jika user mengirim URL penuh, ambil hanya path relatif
        if (photoPath.startsWith("http")) {
          try {
            const urlObj = new URL(photoPath);
            photoPath = urlObj.pathname; // hanya /uploads/xxxx.jfif
          } catch (e) {
            console.error("Invalid URL:", photoPath);
          }
        }

        return {
          name: m.name || "",
          role: m.role || "",
          photo: photoPath, // simpan path relatif saja
        };
      });
    }

    await section.save();

    const baseUrl = process.env.BASE_URL || "https://sevenseers.id";
    const membersWithFullPath = section.members.map((m) => ({
      name: m.name,
      role: m.role,
      photo: m.photo ? `${baseUrl}${m.photo}` : "",
    }));

    res.json({
      title: section.title,
      caption: section.caption,
      members: membersWithFullPath,
    });
  } catch (err) {
    console.error("Update TeamMemberSection Error:", err);
    res.status(500).json({ message: err.message });
  }
};
