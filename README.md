# Study Material Generator (LLM-Based)

## Project Overview

This project is a full-stack application that allows users to upload study materials and automatically generate summaries and questions using a Large Language Model (LLM).

The system includes:

- User authentication (students & admins)
- File upload and processing
- AI-generated summaries and questions
- Study history tracking
- Download/export functionality

---

### AI Generation

- Generate summaries
- Generate questions (multiple choice / short answer)

### Study Tools

- View generated materials
- Access study history
- Download/export content

project-folder/
│
├── frontend/
│ ├── src/
│ │ ├── components/
│ │ ├── pages/
│ │ ├── services/
│ │ ├── hooks/
│ │ ├── styles/
│ │ └── App.tsx
│ └── package.json
│
├── backend/
│ ├── app/
│ │ ├── api/
│ │ ├── services/
│ │ ├── models/
│ │ ├── schemas/
│ │ ├── core/
│ │ └── main.py
│ └── requirements.txt
│
├── database/
│ ├── schema.sql
│ ├── seed.sql
│ └── backup/
│
├── docs/
│ └── design.md
│
├── README.md
└── task-tracker.xlsx

Files or acvtivities in each folder
I'm assuming we use typescript/could use javascript ofr frontend

ENSF400-Project
Project Structure

The project folder ENSF400 is organized into three main directories: frontend, backend, and database, along with supporting files in the root directory.

The frontend folder contains all user interface code built using React and JavaScript ( Suggestion,). Inside src/pages, the main application pages include SignupPage.jsx, LoginPage.jsx, StudentDashboard.jsx, AdminDashboard.jsx, and HistoryPage.jsx. The src/components folder contains reusable UI elements such as FileUpload.jsx, UploadStatus.jsx, StudyViewer.jsx, ExportButton.jsx, Loader.jsx, ErrorMessage.jsx, and SuccessMessage.jsx. The src/services folder includes api.js, which handles communication with the backend, while the src/styles folder contains styling files such as global.css, responsive.css, and dashboard.css. The frontend also includes App.jsx as the main application component, main.jsx as the entry point, and package.json for dependencies.

The backend folder contains the server-side logic implemented using FastAPI and Python ( Just a sugguestion). Within the app/api directory, the main API route files are auth.py, upload.py, generate.py, history.py, and admin.py. The app/services folder contains business logic files including llm_service.py, file_service.py, history_service.py, and export_service.py. Database models are defined in app/models with files such as user.py, upload.py, and summary.py. Data validation is handled in app/schemas, which includes auth_schema.py, upload_schema.py, generate_schema.py, history_schema.py, and admin_schema.py. Configuration and security logic are placed in app/core, including config.py, security.py, and auth_utils.py. The backend also includes main.py as the application entry point, requirements.txt for dependencies, and a .env file for environment variables such as API keys and database credentials.

The database folder contains all database-related resources. This includes schema.sql for defining tables, seed.sql for optional sample data, and a backup/ directory for backup and recovery files.

At the root level, the project includes README.md for documentation, .gitignore to exclude unnecessary files from version control, and task-tracker.xlsx for tracking project progress.
