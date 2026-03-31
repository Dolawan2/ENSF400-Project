const { extractText } = require('../services/file.service');
const uploadQueries = require('../db/queries/uploads');
const ApiError = require('../utils/ApiError');

async function uploadFile(req, res, next) {
  try {
    if (!req.file) {
      throw new ApiError(400, 'No file provided.');
    }

    const { originalname, mimetype, size, buffer } = req.file;
    const extractedText = await extractText(buffer, mimetype);

    const upload = await uploadQueries.createUpload(
      req.user.userId,
      originalname,
      mimetype,
      size,
      extractedText
    );

    res.status(201).json({ upload });
  } catch (err) {
    next(err);
  }
}

async function listUploads(req, res, next) {
  try {
    const uploads = await uploadQueries.findByUserId(req.user.userId);
    res.json({ uploads });
  } catch (err) {
    next(err);
  }
}

async function getUpload(req, res, next) {
  try {
    const upload = await uploadQueries.findById(req.params.id);
    if (!upload) {
      throw new ApiError(404, 'Upload not found.');
    }
    if (upload.user_id !== req.user.userId && req.user.role !== 'admin') {
      throw new ApiError(403, 'Access denied.');
    }
    res.json({ upload });
  } catch (err) {
    next(err);
  }
}

async function deleteUpload(req, res, next) {
  try {
    const upload = await uploadQueries.findById(req.params.id);
    if (!upload) {
      throw new ApiError(404, 'Upload not found.');
    }
    if (upload.user_id !== req.user.userId && req.user.role !== 'admin') {
      throw new ApiError(403, 'Access denied.');
    }
    await uploadQueries.deleteUpload(req.params.id);
    res.json({ message: 'Upload deleted.' });
  } catch (err) {
    next(err);
  }
}

module.exports = { uploadFile, listUploads, getUpload, deleteUpload };
