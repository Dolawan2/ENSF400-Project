const pool = require('../../config/database');

async function createUpload(userId, originalName, mimeType, fileSize, extractedText) {
  const { rows } = await pool.query(
    `INSERT INTO uploads (user_id, original_name, mime_type, file_size, extracted_text)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, user_id, original_name, mime_type, file_size, created_at`,
    [userId, originalName, mimeType, fileSize, extractedText]
  );
  return rows[0];
}

async function findByUserId(userId) {
  const { rows } = await pool.query(
    'SELECT id, original_name, mime_type, file_size, created_at FROM uploads WHERE user_id = $1 ORDER BY created_at DESC',
    [userId]
  );
  return rows;
}

async function findById(id) {
  const { rows } = await pool.query(
    'SELECT * FROM uploads WHERE id = $1',
    [id]
  );
  return rows[0] || null;
}

async function deleteUpload(id) {
  await pool.query('DELETE FROM uploads WHERE id = $1', [id]);
}

module.exports = { createUpload, findByUserId, findById, deleteUpload };
