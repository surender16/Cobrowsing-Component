import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = express.Router();

// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);

// Allowed MIME types and extensions
const ALLOWED_MIME = new Set([
  'image/jpeg',
  'image/png',
  'image/gif',
  'application/pdf',
  'video/webm',
  'video/mp4',
  'audio/mpeg',
  'audio/wav',
]);
const ALLOWED_EXT = new Set(['jpg','jpeg','png','gif','pdf','webm','mp4','mp3','wav']);

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const rawName = file.originalname || 'file';
    const safeBase = rawName.replace(/[^a-zA-Z0-9_.-]/g, '_');
    const uniqueName = `${Date.now()}-${safeBase}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB
  fileFilter: (req, file, cb) => {
    try {
      const ext = (file.originalname?.split('.').pop() || '').toLowerCase();
      if (!ALLOWED_EXT.has(ext) || !ALLOWED_MIME.has(file.mimetype)) {
        return cb(new Error('Unsupported file type'));
      }
      cb(null, true);
    } catch (e) {
      cb(new Error('Invalid file'));
    }
  },
});

const BASE_URL = process.env.BASE_URL || "";

// POST /api/upload
router.post("/upload", (req, res, next) => {
  upload.single("file")(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message || 'Upload failed' });
    }
    if (!req.file) {
      return res
        .status(400)
        .json({ error: "No file uploaded or invalid file type" });
    }

    const fileUrl = BASE_URL
      ? `${BASE_URL}/uploads/${req.file.filename}`
      : `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

    res.json({ name: req.file.originalname, url: fileUrl });
  });
});

export default router;
