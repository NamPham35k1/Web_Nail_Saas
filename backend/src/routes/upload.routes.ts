import { Router, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { authenticate, requireTenant, AuthenticatedRequest } from '../middleware/auth.js';

const router = Router();
const uploadDir = process.env.UPLOAD_DIR || './uploads';

// Ensure upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `file-${uniqueSuffix}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Chỉ chấp nhận file định dạng hình ảnh (PNG, JPG, WEBP).'));
    }
  }
});

router.post('/', authenticate, requireTenant, upload.single('image'), (req: AuthenticatedRequest, res: Response): any => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Vui lòng chọn file hình ảnh cần tải lên.' });
    }

    const backendUrl = process.env.BACKEND_URL || 'http://localhost:5000';
    const fileUrl = `${backendUrl}/uploads/${req.file.filename}`;

    return res.json({
      message: 'Tải ảnh lên thành công!',
      url: fileUrl,
      filename: req.file.filename
    });
  } catch (error) {
    console.error('upload error:', error);
    return res.status(500).json({ error: 'Lỗi khi tải ảnh lên.' });
  }
});

export default router;
