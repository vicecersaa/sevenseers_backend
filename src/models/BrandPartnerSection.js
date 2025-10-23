const mongoose = require("mongoose");

// Schema untuk tiap card
const cardSchema = new mongoose.Schema(
  {
    title: { type: String, default: "" },
    caption: { type: String, default: "" },
    image: { type: String, default: "" }, // path gambar
  },
  { _id: false } // supaya tiap card tidak memiliki _id tambahan
);

// Schema utama BrandPartnerSection
const brandPartnerSchema = new mongoose.Schema(
  {
    title: { type: String, default: "Our Brand Partners" },
    caption: { type: String, default: "" },
    cards: {
      type: [cardSchema],
      default: [
        { title: "Card 1 Title", caption: "Card 1 Caption", image: "" },
        { title: "Card 2 Title", caption: "Card 2 Caption", image: "" },
        { title: "Card 3 Title", caption: "Card 3 Caption", image: "" },
      ],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("BrandPartnerSection", brandPartnerSchema);
