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

/ENSF400-Project
├── frontend/
│ └── src/
│ ├── pages/ I'm assuming we use typescript/could use javascript
│ │ SignupPage.tsx
│ │ LoginPage.tsx
│ │ StudentDashboard.tsx
│ │ AdminDashboard.tsx
│ │ HistoryPage.tsx
│ ├── components/
│ │ FileUpload.tsx
│ │ UploadStatus.tsx
│ │ StudyViewer.tsx
│ │ ExportButton.tsx
│ │ Loader.tsx
│ │ ErrorMessage.tsx
│ ├── services/
│ │ api.ts
│ ├── styles/
│ │ global.css
│ ├── App.tsx
│ └── main.tsx
├── backend/
│ ├── app/
│ │ ├── api/
│ │ │ auth.py
│ │ │ upload.py
│ │ │ generate.py
│ │ │ history.py
│ │ │ admin.py
│ │ ├── services/
│ │ │ llm_service.py
│ │ │ file_service.py
│ │ │ history_service.py
│ │ ├── models/
│ │ │ user.py
│ │ │ upload.py
│ │ │ summary.py
│ │ ├── schemas/
│ │ │ auth_schema.py
│ │ │ upload_schema.py
│ │ │ generate_schema.py
│ │ ├── core/
│ │ │ config.py
│ │ │ security.py
│ │ │ auth_utils.py
│ │ └── main.py
│ ├── requirements.txt
│ └── .env
├── database/
│ schema.sql
│ seed.sql
│ backup/
├── README.md
└── task-tracker.xlsx
