const ApiError = require('../utils/ApiError');

function errorHandler(err, req, res, next) {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({ error: err.message });
  }

  if (err.name === 'MulterError') {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large.' });
    }
    return res.status(400).json({ error: err.message });
  }

  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error.' });
}

module.exports = errorHandler;
