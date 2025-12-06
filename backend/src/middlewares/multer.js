// src/middlewares/upload.js
import multer from 'multer';
import fs from 'node:fs';
import { TEMP_UPLOAD_DIR } from '../constans/index.js';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    fs.mkdir(TEMP_UPLOAD_DIR, { recursive: true }, (err) => {
      cb(err, TEMP_UPLOAD_DIR);
    });
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now();

    const safeName = file.originalname.replace(/\s+/g, '_');
    cb(null, `${uniqueSuffix}_${safeName}`);
  },
});

export const upload = multer({ storage });
