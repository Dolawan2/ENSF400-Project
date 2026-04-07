# StudyDigest

A full-stack web application that allows students to upload PDF notes and generate AI-powered summaries and practice questions using Google Gemini.

## Project Structure

```
├── backend/
│   ├── app/              # LLM microservice (Python/FastAPI)
│   └── src/              # Main backend API (Node.js/Express)
├── frontend/             # React frontend (Vite)
└── database/             # PostgreSQL schema and seed files
```

## Prerequisites

- **Node.js** (v18+)
- **Python** (3.10+)
- **PostgreSQL** (v14+)

## Setup

### 0. TLS Certificate (HTTPS)

The whole app runs over HTTPS in development. Generate a self-signed certificate for `localhost` (one-time, per developer):

```bash
cd backend && mkdir -p certs && cd certs && \
  openssl req -x509 -newkey rsa:2048 -nodes -keyout localhost.key -out localhost.crt \
    -days 365 -subj "/CN=localhost" -addext "subjectAltName=DNS:localhost,IP:127.0.0.1"
```

The `backend/certs/` directory is gitignored — each developer generates their own. The first time you visit the site, your browser will warn about the self-signed cert. Click **Advanced → Proceed to localhost** to accept it (also do this for `https://localhost:3000` if the API requests fail).

### 1. Database

Create the database and run the schema:

```bash
createdb studydigest
psql -d studydigest -f database/schema.sql
```

Optionally seed with test users:

```bash
psql -d studydigest -f database/seed.sql
```

### 2. Backend (Node.js API)

```bash
cd backend
cp .env.example .env
```

Edit `.env` with your database credentials:

```
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=studydigest
DB_USER=your_db_user
DB_PASSWORD=your_db_password
JWT_SECRET=your-secret-key
LLM_BASE_URL=https://localhost:8000
```

Install dependencies and start:

```bash
npm install
npm start
```

The API will be running at `https://localhost:3000`.

### 3. LLM Microservice (Python/FastAPI)

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

Add your Gemini API key to `backend/.env`:

```
GEMINI_API_KEY=your-gemini-api-key
```

Start the LLM service (uses the same self-signed cert as the Node backend):

```bash
uvicorn app.main:studyDigestApp --reload --port 8000 \
  --ssl-keyfile certs/localhost.key --ssl-certfile certs/localhost.crt
```

The LLM service will be running at `https://localhost:8000`.

### 4. Frontend (React)

```bash
cd frontend
npm install
npm run dev
```

The frontend will be running at `https://localhost:5173`.

## Running the Full Application

You need three terminals running simultaneously:

```bash
# Terminal 1 - Backend API
cd backend && npm start

# Terminal 2 - LLM Service
cd backend && source venv/bin/activate && uvicorn app.main:studyDigestApp --reload --port 8000 \
  --ssl-keyfile certs/localhost.key --ssl-certfile certs/localhost.crt

# Terminal 3 - Frontend
cd frontend && npm run dev
```

Then open https://localhost:5173 in your browser.

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | No | Register a new user |
| POST | `/api/auth/login` | No | Login |
| POST | `/api/upload` | Yes | Upload a PDF |
| POST | `/api/generate` | Yes | Generate summary/questions |
| GET | `/api/download/:id` | Yes | Download generated content |
| GET | `/api/user/profile` | Yes | Get user profile |
| GET | `/api/user/history` | Yes | Get generation history |
| GET | `/api/admin/users` | Admin | List all users |
| DELETE | `/api/admin/users/:id` | Admin | Delete a user |
