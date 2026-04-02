const userQueries = require('../db/queries/users');
const ApiError = require('../utils/ApiError');

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function validateUUID(id) {
  if (!UUID_REGEX.test(id)) {
    throw new ApiError(400, 'Invalid user ID format.');
  }
}

async function listUsers(req, res, next) {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;

    if (page < 1) throw new ApiError(400, 'Page must be a positive integer.');
    if (limit < 1 || limit > 100) throw new ApiError(400, 'Limit must be between 1 and 100.');

    const result = await userQueries.findAllUsers(page, limit);
    res.json({ ...result, page, limit });
  } catch (err) {
    next(err);
  }
}

async function getUser(req, res, next) {
  try {
    validateUUID(req.params.id);
    const user = await userQueries.findById(req.params.id);
    if (!user) {
      throw new ApiError(404, 'User not found.');
    }
    res.json({ user });
  } catch (err) {
    next(err);
  }
}

async function updateUser(req, res, next) {
  try {
    validateUUID(req.params.id);
    const { name, email, role } = req.body;

    // Check email uniqueness if email is being updated
    if (email) {
      const existing = await userQueries.findByEmail(email);
      if (existing && existing.id !== req.params.id) {
        throw new ApiError(409, 'Email is already in use by another account.');
      }
    }

    const user = await userQueries.updateUser(req.params.id, { name, email, role });
    if (!user) {
      throw new ApiError(404, 'User not found.');
    }
    res.json({ user });
  } catch (err) {
    next(err);
  }
}

async function deleteUser(req, res, next) {
  try {
    validateUUID(req.params.id);

    // Prevent admin from deleting their own account
    if (req.params.id === req.user.userId) {
      throw new ApiError(403, 'Cannot delete your own account.');
    }

    const user = await userQueries.findById(req.params.id);
    if (!user) {
      throw new ApiError(404, 'User not found.');
    }
    await userQueries.deleteUser(req.params.id);
    res.json({ message: 'User deleted.' });
  } catch (err) {
    next(err);
  }
}

module.exports = { listUsers, getUser, updateUser, deleteUser };
