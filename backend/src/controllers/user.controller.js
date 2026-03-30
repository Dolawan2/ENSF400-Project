const userQueries = require('../db/queries/users');
const genQueries = require('../db/queries/generations');
const ApiError = require('../utils/ApiError');

async function getProfile(req, res, next) {
  try {
    const user = await userQueries.findById(req.user.userId);
    if (!user) {
      throw new ApiError(404, 'User not found.');
    }
    res.json({ user });
  } catch (err) {
    next(err);
  }
}

async function updateProfile(req, res, next) {
  try {
    const { name, email } = req.body;
    const user = await userQueries.updateUser(req.user.userId, { name, email });
    if (!user) {
      throw new ApiError(404, 'User not found.');
    }
    res.json({ user });
  } catch (err) {
    next(err);
  }
}

async function getHistory(req, res, next) {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const result = await genQueries.findByUserId(req.user.userId, page, limit);
    res.json({ ...result, page, limit });
  } catch (err) {
    next(err);
  }
}

module.exports = { getProfile, updateProfile, getHistory };
