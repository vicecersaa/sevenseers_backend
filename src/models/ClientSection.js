const mongoose = require('mongoose');

const clientSectionSchema = new mongoose.Schema(
  {
    title: { type: String, default: "Our Clients" },
    logos: { type: [String], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ClientSection", clientSectionSchema);