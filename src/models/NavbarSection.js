const mongoose = require("mongoose");

const navbarSectionSchema = new mongoose.Schema(
  {
    logo: {
      type: String,
      default: "",
    },
    ctaText: {
      type: String,
      default: "Get Started",
    },
    ctaLink: {
      type: String,
      default: "/contact",
    },
    // 🔥 Tambahan: daftar menu yang bisa diatur urutannya
    menuItems: [
      {
        title: { type: String, required: true },
        link: { type: String, required: true },
        order: { type: Number, default: 999 }, // biar bisa diurutkan
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("NavbarSection", navbarSectionSchema);
