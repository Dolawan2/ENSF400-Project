import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

// Reuse the backend's self-signed cert for the dev server so the whole app
// runs over HTTPS in development. Generate it via:
//   cd backend && mkdir -p certs && cd certs && \
//   openssl req -x509 -newkey rsa:2048 -nodes -keyout localhost.key -out localhost.crt \
//     -days 365 -subj "/CN=localhost" -addext "subjectAltName=DNS:localhost,IP:127.0.0.1"
const keyPath = path.resolve(__dirname, '..', 'backend', 'certs', 'localhost.key')
const certPath = path.resolve(__dirname, '..', 'backend', 'certs', 'localhost.crt')

const httpsOptions =
  fs.existsSync(keyPath) && fs.existsSync(certPath)
    ? { key: fs.readFileSync(keyPath), cert: fs.readFileSync(certPath) }
    : undefined

export default defineConfig({
  plugins: [react()],
  server: {
    https: httpsOptions,
  },
})
