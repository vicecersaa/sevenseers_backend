const mongoose = require("mongoose");

// Schema untuk tiap card
const cardSchema = new mongoose.Schema(
  {
    title: { type: String, default: "" },
    caption: { type: String, default: "" },
    images: [
      {
        src: { type: String, default: "" },
        caption: { type: String, default: "" },
      },
    ],
  },
  { _id: false } // agar tiap image di card tidak memiliki _id
);

// Schema utama HowWeElevateSection
const howWeElevateSchema = new mongoose.Schema(
  {
    title: { type: String, default: "How We Elevate Your Brand" },
    caption: { type: String, default: "" },
    cards: {
      type: [cardSchema],
      default: [
        {
          title: "Card 1 Title",
          caption: "Card 1 Caption",
          images: [
            { src: "", caption: "Image 1 Caption" },
            { src: "", caption: "Image 2 Caption" },
            { src: "", caption: "Image 3 Caption" },
          ],
        },
        {
          title: "Card 2 Title",
          caption: "Card 2 Caption",
          images: [
            { src: "", caption: "Image 1 Caption" },
            { src: "", caption: "Image 2 Caption" },
            { src: "", caption: "Image 3 Caption" },
          ],
        },
        {
          title: "Card 3 Title",
          caption: "Card 3 Caption",
          images: [
            { src: "", caption: "Image 1 Caption" },
            { src: "", caption: "Image 2 Caption" },
            { src: "", caption: "Image 3 Caption" },
          ],
        },
      ],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("HowWeElevateSection", howWeElevateSchema);
