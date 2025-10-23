const mongoose = require("mongoose");

const navbarSectionSchema = new mongoose.Schema(
  {
    logo: {
      type: String,
      default: "", // path ke file logo, misal: "/uploads/logo.png"
    },
    ctaText: {
      type: String,
      default: "Get Started",
    },
    ctaLink: {
      type: String,
      default: "/contact",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("NavbarSection", navbarSectionSchema);
