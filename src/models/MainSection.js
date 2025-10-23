const mongoose = require('mongoose');

const mainSectionSchema = new mongoose.Schema(
  {
    title: { type: String, default: "Welcome to Our Website" },
    videoSrc: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("MainSection", mainSectionSchema);
