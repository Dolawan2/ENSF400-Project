require('dotenv').config();

const app = require('./app');
const pool = require('./config/database');
const config = require('./config');

async function start() {
  try {
    await pool.query('SELECT NOW()');
    console.log('Connected to PostgreSQL');

    app.listen(config.port, () => {
      console.log(`Backend server running on http://localhost:${config.port}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err.message);
    process.exit(1);
  }
}

start();
