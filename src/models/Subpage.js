const mongoose = require("mongoose");

const CardSchema = new mongoose.Schema({
  image: String,
  title: String,
  caption: String,
});

const SubpageSchema = new mongoose.Schema({
  slug: { type: String, unique: true, required: true },
  title: { type: String, required: true },
  content: { type: String },
  bannerImage: { type: String },
  headTitle: { type: String },
  headCaption: { type: String },
  cards: [CardSchema],

 
  order: {
    type: Number,
    default: 0, // nilai default 0 biar ga error waktu belum diset
  },
});

module.exports = mongoose.model("Subpage", SubpageSchema);
