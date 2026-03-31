const { hashPassword, verifyPassword, signToken } = require('../services/auth.service');
const userQueries = require('../db/queries/users');
const ApiError = require('../utils/ApiError');

async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;

    const existing = await userQueries.findByEmail(email);
    if (existing) {
      throw new ApiError(409, 'Email already registered.');
    }

    const passwordHash = await hashPassword(password);
    const user = await userQueries.createUser(name, email, passwordHash);
    const token = signToken(user.id, user.role);

    res.status(201).json({ user, token });
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    const user = await userQueries.findByEmail(email);
    if (!user) {
      throw new ApiError(401, 'Invalid email or password.');
    }

    const valid = await verifyPassword(user.password_hash, password);
    if (!valid) {
      throw new ApiError(401, 'Invalid email or password.');
    }

    const token = signToken(user.id, user.role);
    const { password_hash, ...safeUser } = user;

    res.json({ user: safeUser, token });
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login };
