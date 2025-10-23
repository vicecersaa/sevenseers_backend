const express = require("express");
const router = express.Router();
const {
  getHowWeElevateSection,
  updateHowWeElevateSection,
} = require("../controllers/HowWeElevateController");

// GET HowWeElevateSection data
router.get("/", getHowWeElevateSection);

// UPDATE HowWeElevateSection data
router.put("/", updateHowWeElevateSection);

module.exports = router;
