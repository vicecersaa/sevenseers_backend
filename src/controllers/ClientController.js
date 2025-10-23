const ClientSection = require('../models/ClientSection');

// ✅ GET client section
exports.getClientSection = async (req, res) => {
  try {
    const client = await ClientSection.findOne();
    const baseUrl = process.env.BASE_URL || "http://localhost:5000";

    if (!client) {
      return res.json({
        title: "Our Clients",
        logos: [],
      });
    }

    const logos = client.logos.map((logo) =>
      logo.startsWith("http") ? logo : `${baseUrl}${logo}`
    );

    res.json({
      title: client.title || "Our Clients",
      logos,
    });
  } catch (err) {
    console.error("Get ClientSection Error:", err);
    res.status(500).json({ message: err.message });
  }
};

// ✅ UPDATE client section
exports.updateClientSection = async (req, res) => {
  try {
    const { title, logos } = req.body;

    let client = await ClientSection.findOne();
    if (!client) client = new ClientSection();

    if (title) client.title = title;

    // Replace semua logo (tidak concat)
    if (logos && Array.isArray(logos)) {
      client.logos = logos.map(l => l.replace("http://localhost:5000", ""));
    }

    await client.save();

    const baseUrl = process.env.BASE_URL || "http://localhost:5000";
    const allLogos = client.logos.map((logo) =>
      logo.startsWith("http") ? logo : `${baseUrl}${logo}`
    );

    res.json({
      title: client.title,
      logos: allLogos,
    });
  } catch (err) {
    console.error("Update ClientSection Error:", err);
    res.status(500).json({ message: err.message });
  }
};
