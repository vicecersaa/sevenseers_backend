const BrandPartnerSection = require("../models/BrandPartnerSection");

// ✅ GET Brand Partner Section
exports.getBrandPartnerSection = async (req, res) => {
  try {
    const section = await BrandPartnerSection.findOne();
    const baseUrl = process.env.BASE_URL || "http://localhost:5000";

    if (!section) {
      return res.json({
        title: "Our Brand Partners",
        caption: "Your caption here",
        cards: [
          { title: "Card 1", caption: "Caption 1", image: "" },
          { title: "Card 2", caption: "Caption 2", image: "" },
          { title: "Card 3", caption: "Caption 3", image: "" },
        ],
      });
    }

    // Tambahkan baseUrl untuk tiap image
    const formattedCards = section.cards.map((card) => ({
      ...card._doc,
      image: card.image ? `${baseUrl}${card.image}` : "",
    }));

    res.json({
      title: section.title,
      caption: section.caption,
      cards: formattedCards,
    });
  } catch (err) {
    console.error("Get BrandPartnerSection Error:", err);
    res.status(500).json({ message: err.message });
  }
};

// ✅ UPDATE Brand Partner Section
exports.updateBrandPartnerSection = async (req, res) => {
  try {
    const { title, caption, cards } = req.body;

    let section = await BrandPartnerSection.findOne();
    if (!section) section = new BrandPartnerSection();

    // Update section fields
    section.title = title || section.title;
    section.caption = caption || section.caption;

    if (Array.isArray(cards) && cards.length === 3) {
      section.cards = cards.map((card, idx) => ({
        title: card.title || section.cards[idx]?.title || `Card ${idx + 1}`,
        caption: card.caption || section.cards[idx]?.caption || `Caption ${idx + 1}`,
        image: card.image
          ? card.image.replace(process.env.BASE_URL || "http://localhost:5000", "")
          : section.cards[idx]?.image || "",
      }));
    }

    await section.save();

    const baseUrl = process.env.BASE_URL || "http://localhost:5000";

    const formattedCards = section.cards.map((card) => ({
      ...card._doc,
      image: card.image ? `${baseUrl}${card.image}` : "",
    }));

    res.json({
      title: section.title,
      caption: section.caption,
      cards: formattedCards,
    });
  } catch (err) {
    console.error("Update BrandPartnerSection Error:", err);
    res.status(500).json({ message: err.message });
  }
};
