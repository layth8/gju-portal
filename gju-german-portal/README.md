# GJU German Year Portal

Web app for German Jordanian University students preparing for the Deutschjahr: partner universities, language tracks, and German Embassy Amman visa steps.

## Stack

- **Backend:** FastAPI, SQLAlchemy 2.0, PyMySQL, Pydantic v2
- **Frontend:** React, TypeScript, Vite, Tailwind CSS, Lucide React, Axios
- **Database:** MySQL `gju_german_portal` on `localhost:3306`

## Setup

### 1. MySQL

```sql
CREATE DATABASE gju_german_portal CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
```

Edit `.env` and set `DATABASE_URL` (replace `YOUR_PASSWORD`) and `ADMIN_API_KEY`.

```bash
python -m app.seed
uvicorn app.main:app --reload --port 8000
```

API docs: http://localhost:8000/docs

### 3. Frontend

```bash
cd frontend
npm install
copy .env.example .env
npm run dev
```

Open http://localhost:5173

Admin panel uses the `X-Admin-Key` header. Enter the same value as `ADMIN_API_KEY`.

## API

| Method | Path | Notes |
| --- | --- | --- |
| GET | `/api/majors` | All GJU majors |
| GET | `/api/universities?major_id=&german_level=&city=` | Filtered search |
| GET | `/api/universities/{id}` | Detail |
| GET | `/api/visa-steps` | Embassy checklist |
| POST/PUT/DELETE | `/api/admin/universities` | Requires `X-Admin-Key` |
