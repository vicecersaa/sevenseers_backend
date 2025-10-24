const express = require('express');
const multer = require('multer');
const ftp = require('basic-ftp');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// Folder temporary buat nyimpen file sebelum di-upload ke FTP
const tempUploadDir = path.join(__dirname, '../temp_uploads');
if (!fs.existsSync(tempUploadDir)) fs.mkdirSync(tempUploadDir, { recursive: true });

// Setup multer untuk simpan sementara file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, tempUploadDir),
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // nama unik
  }
});
const upload = multer({ storage });

// Fungsi upload ke FTP Hostinger
async function uploadToFtp(localFilePath, remoteFileName) {
  const client = new ftp.Client();
  try {
    await client.access({
      host: "145.79.14.21",      // ganti dengan host FTP kamu
      user: "u111458258.sevenseers.id",            // ganti username FTP kamu
      password: "Demonslash@123",        // ganti password FTP kamu
      secure: false,                   // true kalau pakai FTPS
    });

    // Upload file ke folder public_html/uploads di Hostinger
    await client.uploadFrom(localFilePath, `uploads/${remoteFileName}`);
  } catch (error) {
    throw error;
  } finally {
    client.close();
  }
}

// Endpoint POST /api/upload
router.post('/', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

  const localPath = req.file.path;
  const remoteFileName = req.file.filename;

  try {
    await uploadToFtp(localPath, remoteFileName);

    // Hapus file lokal setelah berhasil upload ke FTP
    fs.unlinkSync(localPath);

    // URL file yang bisa diakses publik
    const fileUrl = `https://sevenseers.id/uploads/${remoteFileName}`;
    res.json({ success: true, fileUrl });
  } catch (err) {
    // Hapus file lokal kalau gagal
    if (fs.existsSync(localPath)) fs.unlinkSync(localPath);
    res.status(500).json({ success: false, message: 'Upload gagal', error: err.message });
  }
});

module.exports = router;
