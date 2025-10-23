const HowWeElevateSection = require("../models/HowWeElevateSection");

// ✅ GET HowWeElevateSection
exports.getHowWeElevateSection = async (req, res) => {
  try {
    const section = await HowWeElevateSection.findOne();
    const baseUrl = process.env.BASE_URL || "http://localhost:5000";

    if (!section) {
      return res.json({
        title: "How We Elevate Your Brand",
        caption: "",
        cards: [
          { title: "", caption: "", images: [{ src: "", caption: "" }, { src: "", caption: "" }, { src: "", caption: "" }] },
          { title: "", caption: "", images: [{ src: "", caption: "" }, { src: "", caption: "" }, { src: "", caption: "" }] },
          { title: "", caption: "", images: [{ src: "", caption: "" }, { src: "", caption: "" }, { src: "", caption: "" }] },
        ],
      });
    }

    // Convert image paths ke URL lengkap, hapus folder tambahan if any
    const cards = section.cards.map((card) => ({
      ...card._doc,
      images: card.images.map((img) => ({
        ...img._doc,
        src: img.src ? `${baseUrl}${img.src.replace("/uploads/howwelevate", "/uploads")}` : "",
      })),
    }));

    res.json({
      title: section.title,
      caption: section.caption,
      cards,
    });
  } catch (err) {
    console.error("Get HowWeElevateSection Error:", err);
    res.status(500).json({ message: err.message });
  }
};

// ✅ UPDATE HowWeElevateSection
exports.updateHowWeElevateSection = async (req, res) => {
  try {
    const { title, caption, cards } = req.body;

    let section = await HowWeElevateSection.findOne();
    if (!section) section = new HowWeElevateSection();

    // Update fields
    section.title = title || section.title;
    section.caption = caption || section.caption;

    // Update cards if provided
    if (Array.isArray(cards) && cards.length > 0) {
      section.cards = cards.map((card) => ({
        title: card.title || "",
        caption: card.caption || "",
        images: Array.isArray(card.images)
          ? card.images.map((img) => ({
              // Simpan src relative ke folder /uploads saja
              src: img.src ? img.src.replace(process.env.BASE_URL || "http://localhost:5000", "").replace("/uploads/howwelevate", "/uploads") : "",
              caption: img.caption || "",
            }))
          : [],
      }));
    }

    await section.save();

    const baseUrl = process.env.BASE_URL || "http://localhost:5000";
    const responseCards = section.cards.map((card) => ({
      ...card._doc,
      images: card.images.map((img) => ({
        ...img._doc,
        src: img.src ? `${baseUrl}${img.src}` : "",
      })),
    }));

    res.json({
      title: section.title,
      caption: section.caption,
      cards: responseCards,
    });
  } catch (err) {
    console.error("Update HowWeElevateSection Error:", err);
    res.status(500).json({ message: err.message });
  }
};
