const genQueries = require('../db/queries/generations');
const { formatTxt, formatCsv, formatMd } = require('../services/export.service');
const ApiError = require('../utils/ApiError');

async function download(req, res, next) {
  try {
    const generation = await genQueries.findById(req.params.generationId);
    if (!generation) {
      throw new ApiError(404, 'Generation not found.');
    }
    if (generation.user_id !== req.user.userId && req.user.role !== 'admin') {
      throw new ApiError(403, 'Access denied.');
    }

    const format = req.query.format || 'txt';

    let content, contentType, ext;
    switch (format) {
      case 'csv':
        content = formatCsv(generation);
        contentType = 'text/csv';
        ext = 'csv';
        break;
      case 'md':
        content = formatMd(generation);
        contentType = 'text/markdown';
        ext = 'md';
        break;
      default:
        content = formatTxt(generation);
        contentType = 'text/plain';
        ext = 'txt';
    }

    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename="study-material.${ext}"`);
    res.send(content);
  } catch (err) {
    next(err);
  }
}

module.exports = { download };
