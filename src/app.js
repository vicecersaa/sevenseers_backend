const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');
const cors = require('cors');
const fs = require('fs');

// Load env
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());

// 🧩 Agar semua jenis body bisa kebaca
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Pastikan folder uploads ada
const uploadsPath = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadsPath)) fs.mkdirSync(uploadsPath, { recursive: true });
console.log("Serving uploads from:", uploadsPath);

// Serve uploads folder dengan MIME type
app.use(
  "/uploads",
  express.static(uploadsPath, {
    setHeaders: (res, filePath) => {
      if (filePath.endsWith(".mp4")) res.setHeader("Content-Type", "video/mp4");
      else if (filePath.endsWith(".png")) res.setHeader("Content-Type", "image/png");
      else if (filePath.endsWith(".jpg") || filePath.endsWith(".jpeg"))
        res.setHeader("Content-Type", "image/jpeg");
    },
  })
);

// Routes
app.use('/api/site', require('./routes/siteRoutes')); 
app.use('/api/auth', require('./routes/authRoutes')); 
app.use('/api/hero', require('./routes/heroRoutes'));
app.use('/api/upload', require('./routes/uploadRoutes'));
app.use('/api/main', require('./routes/mainRoutes'));
app.use('/api/clients', require('./routes/ClientRoutes'));
app.use('/api/whatwedo', require('./routes/WhatWeDoRoutes'));
app.use('/api/howwelevate', require('./routes/HowWeElevateRoutes'));
app.use('/api/brand-partner', require('./routes/BrandPartnerRoutes'));
app.use('/api/team-member', require('./routes/TeamMemberRoutes'));
app.use('/api/bring-your-brand', require('./routes/BringYourBrandRoutes'));
app.use("/api/subpages", require('./routes/Subpages'));
app.use("/api/navbar", require('./routes/NavbarRoutes'));
app.use("/api/footer", require('./routes/FooterRoutes'));
app.use("/api/site/meta/:pageId", require('./routes/siteRoutes'));


// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message });
});

module.exports = app;
