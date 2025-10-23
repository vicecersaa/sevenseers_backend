// src/models/Subpage.js
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
});

module.exports = mongoose.model("Subpage", SubpageSchema);
