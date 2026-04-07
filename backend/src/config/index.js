require('dotenv').config();
const path = require('path');

module.exports = {
  port: parseInt(process.env.PORT, 10) || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',

  tls: {
    keyPath: process.env.TLS_KEY_PATH || path.join(__dirname, '..', '..', 'certs', 'localhost.key'),
    certPath: process.env.TLS_CERT_PATH || path.join(__dirname, '..', '..', 'certs', 'localhost.crt'),
  },

  db: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    database: process.env.DB_NAME || 'studydigest',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
  },

  jwt: {
    secret: process.env.JWT_SECRET || 'change-this-to-a-random-secret',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
  },

  llm: {
    baseUrl: process.env.LLM_BASE_URL || 'https://localhost:8000',
  },

  upload: {
    maxFileSizeMB: parseInt(process.env.MAX_FILE_SIZE_MB, 10) || 10,
  },
};
