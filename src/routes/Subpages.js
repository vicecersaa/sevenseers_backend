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
   ✅ POST buat tambah subpage baru
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

    // 🔹 Cari order terbesar
    const maxOrder = await Subpage.findOne().sort("-order").lean();
    const nextOrder = order ?? (maxOrder ? maxOrder.order + 1 : 1);

    // 🔹 Cek duplikat order
    const duplicateOrder = await Subpage.findOne({ order: nextOrder });
    if (duplicateOrder) {
      return res
        .status(400)
        .json({ message: `Order ${nextOrder} is already used.` });
    }

    const newPage = new Subpage({
      slug,
      title,
      content,
      bannerImage,
      headTitle,
      headCaption,
      cards: cards || [],
      order: nextOrder,
    });

    await newPage.save();
    res.status(201).json({
      message: "Subpage created successfully",
      data: newPage,
    });
  } catch (error) {
    console.error("POST /subpages error:", error);
    res.status(400).json({ message: error.message });
  }
});

/* ==============================
   ✅ PUT untuk update subpage (termasuk order)
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

    // 🔹 Cegah duplikat order
    if (order !== undefined) {
      const duplicate = await Subpage.findOne({
        order,
        _id: { $ne: req.params.id },
      });
      if (duplicate) {
        return res
          .status(400)
          .json({ message: `Order ${order} already used by ${duplicate.title}` });
      }
    }

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
        order,
      },
      { new: true }
    );

    if (!updatedPage)
      return res.status(404).json({ message: "Subpage not found" });

    res.json({
      message: "Subpage updated successfully",
      data: updatedPage,
    });
  } catch (error) {
    console.error("PUT /subpages/:id error:", error);
    res.status(400).json({ message: error.message });
  }
});

/* ==============================
   ✅ PATCH /reorder — ubah urutan semua subpages
============================== */
router.put("/reorder", async (req, res) => {
  try {
    const { subpages } = req.body; // array of { id, order }

    if (!Array.isArray(subpages))
      return res.status(400).json({ message: "Invalid data format" });

    const bulkOps = subpages.map((item) => ({
      updateOne: {
        filter: { _id: item.id },
        update: { order: item.order },
      },
    }));

    await Subpage.bulkWrite(bulkOps);

    res.json({ message: "Subpages reordered successfully" });
  } catch (error) {
    console.error("PUT /subpages/reorder error:", error);
    res.status(500).json({ message: error.message });
  }
});

/* ==============================
   ✅ DELETE subpage (reorder otomatis setelah delete)
============================== */
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Subpage.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Subpage not found" });

    // 🔹 Setelah delete, rapihin urutan lagi
    const pages = await Subpage.find().sort({ order: 1 });
    for (let i = 0; i < pages.length; i++) {
      pages[i].order = i + 1;
      await pages[i].save();
    }

    res.json({ message: "Subpage deleted and reordered successfully" });
  } catch (error) {
    console.error("DELETE /subpages error:", error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
