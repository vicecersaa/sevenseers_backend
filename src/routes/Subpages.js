// src/routes/Subpages.js
const express = require("express");
const Subpage = require("../models/Subpage");

const router = express.Router();

// ✅ GET semua subpages
router.get("/", async (req, res) => {
  try {
    const pages = await Subpage.find();
    res.json(pages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ GET satu subpage by slug (untuk frontend)
router.get("/slug/:slug", async (req, res) => {
  try {
    const page = await Subpage.findOne({ slug: req.params.slug });
    if (!page) return res.status(404).json({ message: "Not found" });
    res.json(page);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ GET satu subpage by ID (untuk dashboard editor)
router.get("/:id", async (req, res) => {
  try {
    const page = await Subpage.findById(req.params.id);
    if (!page) return res.status(404).json({ message: "Not found" });
    res.json(page);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ POST buat tambah subpage baru
router.post("/", async (req, res) => {
  try {
    const { slug, title, content, bannerImage, headTitle, headCaption, cards } = req.body;

    const newPage = new Subpage({
      slug,
      title,
      content,
      bannerImage,
      headTitle,
      headCaption,
      cards: cards || [],
    });

    await newPage.save();
    res.status(201).json({
      message: "Subpage created successfully",
      data: newPage,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ✅ PUT untuk update subpage
router.put("/:id", async (req, res) => {
  try {
    const { title, content, bannerImage, headTitle, headCaption, cards, slug } = req.body;

    const updatedPage = await Subpage.findByIdAndUpdate(
      req.params.id,
      {
        title,
        slug,
        content,
        bannerImage,
        headTitle,
        headCaption,
        cards: cards || [],
      },
      { new: true } // biar return data yang udah di-update
    );

    if (!updatedPage) return res.status(404).json({ message: "Subpage not found" });
    res.json({ message: "Subpage updated successfully", data: updatedPage });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ✅ DELETE subpage
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Subpage.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Subpage not found" });
    res.json({ message: "Subpage deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
