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
LLM_BASE_URL=http://localhost:8000
```

Install dependencies and start:

```bash
npm install
npm start
```

The API will be running at `http://localhost:3000`.

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

Start the LLM service:

```bash
uvicorn app.main:studyDigestApp --reload --port 8000
```

The LLM service will be running at `http://localhost:8000`.

### 4. Frontend (React)

```bash
cd frontend
npm install
npm run dev
```

The frontend will be running at `http://localhost:5173`.

## Running the Full Application

You need three terminals running simultaneously:

```bash
# Terminal 1 - Backend API
cd backend && npm start

# Terminal 2 - LLM Service
cd backend && source venv/bin/activate && uvicorn app.main:studyDigestApp --reload --port 8000

# Terminal 3 - Frontend
cd frontend && npm run dev
```

Then open http://localhost:5173 in your browser.

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
