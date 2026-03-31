const multer = require('multer');
const config = require('../config');

const ALLOWED_TYPES = [
  'application/pdf',
  'text/plain',
  'text/markdown',
];

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: config.upload.maxFileSizeMB * 1024 * 1024 },
  fileFilter(req, file, cb) {
    if (ALLOWED_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE', 'Only PDF, TXT, and MD files are allowed.'));
    }
  },
});

module.exports = upload;
