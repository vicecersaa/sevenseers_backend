const mongoose = require("mongoose");

const whatWeDoSectionSchema = new mongoose.Schema(
  {
    title: { type: String, default: "What We Do" },
    caption: { type: String, default: "Our amazing services" },
    ball1: { type: String, default: "Service 1" },
    ball2: { type: String, default: "Service 2" },
    ball3: { type: String, default: "Service 3" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("WhatWeDoSection", whatWeDoSectionSchema);
