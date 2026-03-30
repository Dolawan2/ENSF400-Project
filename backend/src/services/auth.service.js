const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const config = require('../config');

async function hashPassword(password) {
  return argon2.hash(password);
}

async function verifyPassword(hash, password) {
  return argon2.verify(hash, password);
}

function signToken(userId, role) {
  return jwt.sign({ userId, role }, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  });
}

module.exports = { hashPassword, verifyPassword, signToken };
