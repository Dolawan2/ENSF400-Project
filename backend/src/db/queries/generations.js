const pool = require('../../config/database');

async function createGeneration(uploadId, userId, summary, questionType, questions) {
  const { rows } = await pool.query(
    `INSERT INTO generations (upload_id, user_id, summary, question_type, questions)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [uploadId, userId, summary, questionType, JSON.stringify(questions)]
  );
  return rows[0];
}

async function findById(id) {
  const { rows } = await pool.query(
    'SELECT * FROM generations WHERE id = $1',
    [id]
  );
  return rows[0] || null;
}

async function findByUserId(userId, page = 1, limit = 20) {
  const offset = (page - 1) * limit;
  const { rows } = await pool.query(
    `SELECT g.*, u.original_name
     FROM generations g
     JOIN uploads u ON g.upload_id = u.id
     WHERE g.user_id = $1
     ORDER BY g.created_at DESC
     LIMIT $2 OFFSET $3`,
    [userId, limit, offset]
  );
  const { rows: countRows } = await pool.query(
    'SELECT COUNT(*) FROM generations WHERE user_id = $1',
    [userId]
  );
  return { generations: rows, total: parseInt(countRows[0].count, 10) };
}

async function findByUploadId(uploadId) {
  const { rows } = await pool.query(
    'SELECT * FROM generations WHERE upload_id = $1 ORDER BY created_at DESC',
    [uploadId]
  );
  return rows;
}

module.exports = { createGeneration, findById, findByUserId, findByUploadId };
