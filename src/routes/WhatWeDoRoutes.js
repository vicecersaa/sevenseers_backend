const express = require("express");
const router = express.Router();
const {
  getWhatWeDoSection,
  updateWhatWeDoSection,
} = require("../controllers/WhatWeDoController");

// GET What We Do section data
router.get("/", getWhatWeDoSection);

// UPDATE What We Do section data
router.put("/", updateWhatWeDoSection);

module.exports = router;
