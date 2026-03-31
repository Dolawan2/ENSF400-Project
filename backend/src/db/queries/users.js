const pool = require('../../config/database');

async function createUser(name, email, passwordHash) {
  const { rows } = await pool.query(
    `INSERT INTO users (name, email, password_hash)
     VALUES ($1, $2, $3)
     RETURNING id, name, email, role, created_at`,
    [name, email, passwordHash]
  );
  return rows[0];
}

async function findByEmail(email) {
  const { rows } = await pool.query(
    'SELECT * FROM users WHERE email = $1',
    [email]
  );
  return rows[0] || null;
}

async function findById(id) {
  const { rows } = await pool.query(
    'SELECT id, name, email, role, created_at, updated_at FROM users WHERE id = $1',
    [id]
  );
  return rows[0] || null;
}

async function updateUser(id, fields) {
  const sets = [];
  const values = [];
  let idx = 1;

  if (fields.name) {
    sets.push(`name = $${idx++}`);
    values.push(fields.name);
  }
  if (fields.email) {
    sets.push(`email = $${idx++}`);
    values.push(fields.email);
  }
  if (fields.role) {
    sets.push(`role = $${idx++}`);
    values.push(fields.role);
  }
  if (fields.passwordHash) {
    sets.push(`password_hash = $${idx++}`);
    values.push(fields.passwordHash);
  }

  sets.push(`updated_at = NOW()`);
  values.push(id);

  const { rows } = await pool.query(
    `UPDATE users SET ${sets.join(', ')} WHERE id = $${idx}
     RETURNING id, name, email, role, created_at, updated_at`,
    values
  );
  return rows[0] || null;
}

async function deleteUser(id) {
  await pool.query('DELETE FROM users WHERE id = $1', [id]);
}

async function findAllUsers(page = 1, limit = 20) {
  const offset = (page - 1) * limit;
  const { rows } = await pool.query(
    'SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC LIMIT $1 OFFSET $2',
    [limit, offset]
  );
  const { rows: countRows } = await pool.query('SELECT COUNT(*) FROM users');
  return { users: rows, total: parseInt(countRows[0].count, 10) };
}

module.exports = { createUser, findByEmail, findById, updateUser, deleteUser, findAllUsers };
