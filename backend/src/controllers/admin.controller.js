const userQueries = require('../db/queries/users');
const ApiError = require('../utils/ApiError');

async function listUsers(req, res, next) {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const result = await userQueries.findAllUsers(page, limit);
    res.json({ ...result, page, limit });
  } catch (err) {
    next(err);
  }
}

async function updateUser(req, res, next) {
  try {
    const { name, email, role } = req.body;
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

module.exports = { listUsers, updateUser, deleteUser };
