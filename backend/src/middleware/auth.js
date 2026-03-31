const jwt = require('jsonwebtoken');
const config = require('../config');
const ApiError = require('../utils/ApiError');

function authenticate(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    throw new ApiError(401, 'Authentication required.');
  }

  try {
    const token = header.split(' ')[1];
    const payload = jwt.verify(token, config.jwt.secret);
    req.user = { userId: payload.userId, role: payload.role };
    next();
  } catch {
    throw new ApiError(401, 'Invalid or expired token.');
  }
}

function requireAdmin(req, res, next) {
  if (req.user.role !== 'admin') {
    throw new ApiError(403, 'Admin access required.');
  }
  next();
}

module.exports = { authenticate, requireAdmin };
