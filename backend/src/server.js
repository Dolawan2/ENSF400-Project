require('dotenv').config();

const fs = require('fs');
const https = require('https');
const path = require('path');

const app = require('./app');
const pool = require('./config/database');
const config = require('./config');

async function start() {
  try {
    await pool.query('SELECT NOW()');
    console.log('Connected to PostgreSQL');

    const keyPath = config.tls.keyPath;
    const certPath = config.tls.certPath;

    if (!fs.existsSync(keyPath) || !fs.existsSync(certPath)) {
      console.error(
        `\nTLS certificate not found. Expected:\n  key:  ${keyPath}\n  cert: ${certPath}\n\n` +
        `Generate one with:\n  cd backend && mkdir -p certs && cd certs && \\\n` +
        `  openssl req -x509 -newkey rsa:2048 -nodes -keyout localhost.key -out localhost.crt \\\n` +
        `    -days 365 -subj "/CN=localhost" -addext "subjectAltName=DNS:localhost,IP:127.0.0.1"\n`
      );
      process.exit(1);
    }

    const httpsOptions = {
      key: fs.readFileSync(keyPath),
      cert: fs.readFileSync(certPath),
    };

    https.createServer(httpsOptions, app).listen(config.port, () => {
      console.log(`Backend server running on https://localhost:${config.port}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err.message);
    process.exit(1);
  }
}

start();
