const ClientSection = require('../models/ClientSection');

// ✅ GET client section
exports.getClientSection = async (req, res) => {
  try {
    const client = await ClientSection.findOne();
    const baseUrl = process.env.BASE_URL || "https://sevenseers.id";

    if (!client) {
      return res.json({
        title: "Our Clients",
        logos: [],
      });
    }

    // Filter dan map logos dengan aman
    const logos = client.logos
      .filter(logo => logo && typeof logo === 'string')
      .map((logo) => logo.startsWith("http") ? logo : `${baseUrl}${logo}`);

    res.json({
      title: client.title || "Our Clients",
      logos,
    });
  } catch (err) {
    console.error("Get ClientSection Error:", err);
    res.status(500).json({ message: err.message || "Failed to fetch client section" });
  }
};

// ✅ UPDATE client section
exports.updateClientSection = async (req, res) => {
  try {
    const { title, logos } = req.body;

    // Validasi input logos
    if (logos !== undefined && !Array.isArray(logos)) {
      return res.status(400).json({ 
        message: "Invalid logos data. Must be an array." 
      });
    }

    let client = await ClientSection.findOne();
    if (!client) {
      client = new ClientSection();
    }

    // Update title jika ada
    if (title !== undefined && title !== null) {
      client.title = title;
    }

    // Clean dan normalize logos
    if (logos && Array.isArray(logos)) {
      const cleanedLogos = logos
        .filter(logo => {
          // Filter hanya string yang valid dan tidak kosong
          return logo && typeof logo === 'string' && logo.trim() !== '';
        })
        .map(logo => {
          const trimmedLogo = logo.trim();
          // Remove base URL jika ada (support http dan https)
          return trimmedLogo
            .replace(/^https?:\/\/sevenseers\.id/, '')
            .replace(/^https?:\/\/www\.sevenseers\.id/, '');
        });

      client.logos = cleanedLogos;
    }

    await client.save();

    // Return response dengan base URL lengkap
    const baseUrl = process.env.BASE_URL || "https://sevenseers.id";
    const responseLogos = client.logos
      .filter(logo => logo && typeof logo === 'string')
      .map((logo) => logo.startsWith("http") ? logo : `${baseUrl}${logo}`);

    res.json({
      title: client.title,
      logos: responseLogos,
    });
  } catch (err) {
    console.error("Update ClientSection Error:", err);
    res.status(500).json({ 
      message: err.message || "Failed to update client section" 
    });
  }
};