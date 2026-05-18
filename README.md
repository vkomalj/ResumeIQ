# ResumeIQ — AI-Powered HR Platform

A full-stack HR recruitment platform that uses AI to streamline candidate screening, resume parsing, and job management.

---

## 📁 Repository Structure

```
ResumeIQ/
├── ResumeIQ_FE/     # Next.js Frontend (React, Tailwind CSS, Zustand)
├── ResumeIQ_BE/     # FastAPI Backend (Python, PostgreSQL, SQLAlchemy)
└── .gitignore
```

---

## 🚀 Getting Started

### Frontend

```bash
cd ResumeIQ_FE
npm install
npm run dev
```

Runs on: `http://localhost:3000`

### Backend

```bash
cd ResumeIQ_BE
python -m venv venv
venv\Scripts\activate      # Windows
pip install -r requirements.txt
```

Create a `.env` file in `ResumeIQ_BE/` with:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/resume_db
SECRET_KEY=your_secret_key
MAIL_FROM=your@gmail.com
MAIL_PASSWORD=your_app_password
```

Then run:

```bash
python main.py
```

Runs on: `http://localhost:8000`

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16, Tailwind CSS v4, Framer Motion, Zustand |
| Backend | FastAPI, SQLAlchemy, Alembic, PostgreSQL |
| AI | Custom AI resume extractor & skill matcher |
| Auth | JWT-based authentication |

---

## ✨ Key Features

- **AI Candidate Screening** — Automatically match candidates to job requirements
- **Smart Resume Parsing** — Extract skills and experience from uploaded PDFs
- **Centralized Job Management** — Manage postings, candidates, and pipelines
- **HR Dashboard** — Clean, modern interface built for recruiters
- **Candidate Pool** — Curate and organize top talent for future roles

---

## 📄 License

© 2025 ResumeIQ. All rights reserved.
