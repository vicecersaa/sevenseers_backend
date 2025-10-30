const express = require("express");
const Subpage = require("../models/Subpage");

const router = express.Router();

/* ==============================
   ✅ GET semua subpages (urut berdasarkan order)
============================== */
router.get("/", async (req, res) => {
  try {
    const pages = await Subpage.find().sort({ order: 1 });
    res.json(pages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* ==============================
   ✅ GET satu subpage by slug (frontend)
============================== */
router.get("/slug/:slug", async (req, res) => {
  try {
    const page = await Subpage.findOne({ slug: req.params.slug });
    if (!page) return res.status(404).json({ message: "Not found" });
    res.json(page);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* ==============================
   ✅ GET satu subpage by ID (dashboard)
============================== */
router.get("/:id", async (req, res) => {
  try {
    const page = await Subpage.findById(req.params.id);
    if (!page) return res.status(404).json({ message: "Not found" });
    res.json(page);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* ==============================
   ✅ POST buat tambah subpage baru (auto order)
============================== */
router.post("/", async (req, res) => {
  try {
    const {
      slug,
      title,
      content,
      bannerImage,
      headTitle,
      headCaption,
      cards,
      order,
    } = req.body;

    const total = await Subpage.countDocuments();

    // Jika user tidak set order → taruh paling bawah
    let newOrder = order ?? total + 1;

    // Jika user set order manual → geser urutan setelahnya
    if (order && order <= total) {
      await Subpage.updateMany(
        { order: { $gte: order } },
        { $inc: { order: 1 } }
      );
      newOrder = order;
    }

    const newPage = new Subpage({
      slug,
      title,
      content,
      bannerImage,
      headTitle,
      headCaption,
      cards: cards || [],
      order: newOrder,
    });

    await newPage.save();

    const all = await Subpage.find().sort({ order: 1 });
    res.status(201).json({
      message: "Subpage created successfully",
      data: all,
    });
  } catch (error) {
    console.error("POST /subpages error:", error);
    res.status(400).json({ message: error.message });
  }
});

/* ==============================
   ✅ PUT update subpage (termasuk ubah order)
============================== */
router.put("/:id", async (req, res) => {
  try {
    const {
      title,
      slug,
      content,
      bannerImage,
      headTitle,
      headCaption,
      cards,
      order,
    } = req.body;

    const page = await Subpage.findById(req.params.id);
    if (!page) return res.status(404).json({ message: "Subpage not found" });

    const total = await Subpage.countDocuments();

    // 🔹 Jika order berubah, sesuaikan urutan lain
    if (order && order !== page.order) {
      if (order < page.order) {
        // Geser ke bawah (naikkan urutan item di antara)
        await Subpage.updateMany(
          { order: { $gte: order, $lt: page.order } },
          { $inc: { order: 1 } }
        );
      } else {
        // Geser ke atas (turunkan urutan item di antara)
        await Subpage.updateMany(
          { order: { $lte: order, $gt: page.order } },
          { $inc: { order: -1 } }
        );
      }
      page.order = order;
    }

    page.title = title ?? page.title;
    page.slug = slug ?? page.slug;
    page.content = content ?? page.content;
    page.bannerImage = bannerImage ?? page.bannerImage;
    page.headTitle = headTitle ?? page.headTitle;
    page.headCaption = headCaption ?? page.headCaption;
    page.cards = cards ?? page.cards;

    await page.save();

    const all = await Subpage.find().sort({ order: 1 });
    res.json({
      message: "Subpage updated successfully",
      data: all,
    });
  } catch (error) {
    console.error("PUT /subpages/:id error:", error);
    res.status(400).json({ message: error.message });
  }
});

/* ==============================
   ✅ PATCH /reorder — ubah urutan manual dari dashboard
============================== */
router.put("/reorder", async (req, res) => {
  try {
    const { subpages } = req.body; // [{id, order}]
    if (!Array.isArray(subpages))
      return res.status(400).json({ message: "Invalid format" });

    const bulkOps = subpages.map((item) => ({
      updateOne: {
        filter: { _id: item.id },
        update: { order: item.order },
      },
    }));

    await Subpage.bulkWrite(bulkOps);

    const all = await Subpage.find().sort({ order: 1 });
    res.json({ message: "Reordered successfully", data: all });
  } catch (error) {
    console.error("PUT /subpages/reorder error:", error);
    res.status(500).json({ message: error.message });
  }
});

/* ==============================
   ✅ DELETE subpage + auto normalize order
============================== */
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Subpage.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Subpage not found" });

    // Rapiin ulang order setelah delete
    const pages = await Subpage.find().sort({ order: 1 });
    for (let i = 0; i < pages.length; i++) {
      pages[i].order = i + 1;
      await pages[i].save();
    }

    res.json({ message: "Deleted & reordered successfully", data: pages });
  } catch (error) {
    console.error("DELETE /subpages error:", error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
