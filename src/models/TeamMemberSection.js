const mongoose = require("mongoose");

// Schema untuk tiap member
const memberSchema = new mongoose.Schema(
  {
    name: { type: String, default: "" },
    role: { type: String, default: "" },
    photo: { type: String, default: "" }, // path ke image
  },
  { _id: false } // supaya tiap member tidak auto bikin _id
);

// Schema utama TeamMemberSection
const teamMemberSectionSchema = new mongoose.Schema(
  {
    title: { type: String, default: "Our Team" },
    caption: { type: String, default: "Meet the team behind our success" },
    members: {
      type: [memberSchema],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("TeamMemberSection", teamMemberSectionSchema);
