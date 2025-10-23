const TeamMemberSection = require('../models/TeamMemberSection');
const path = require('path');
const fs = require('fs');

// ✅ GET Team Member Section
exports.getTeamMemberSection = async (req, res) => {
  try {
    const section = await TeamMemberSection.findOne();
    const baseUrl = process.env.BASE_URL || "http://localhost:5000";

    if (!section) {
      return res.json({
        title: "Our Team",
        caption: "",
        members: [],
      });
    }

    // update URL supaya bisa diakses dari frontend
    const membersWithFullPath = section.members.map((m) => ({
      ...m._doc,
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
      // Map member, pastikan photo path mulai dari /uploads/
      section.members = members.map((m) => ({
        name: m.name || "",
        role: m.role || "",
        photo: m.photo
          ? m.photo.replace("http://localhost:5000/uploads/team/", "/uploads/")
          : "",
      }));
    }

    await section.save();

    const baseUrl = process.env.BASE_URL || "http://localhost:5000";
    const membersWithFullPath = section.members.map((m) => ({
      ...m._doc,
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
