const mongoose = require("mongoose");

const bringYourBrandSchema = new mongoose.Schema(
  {
    backgroundImage: { type: String, default: "" },
    title: { type: String, default: "Bring Your Brand Alive" },
    ctaText: { type: String, default: "Connect Now" },
    ctaLink: { type: String, default: "#" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("BringYourBrandSection", bringYourBrandSchema);
