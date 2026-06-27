# Deployment Guide

## Local Development

### Prerequisites
- Node.js 18+
- npm

### Setup (one-time)

```bash
npm run setup
```

This installs frontend + backend dependencies and seeds the database.

### Run

Terminal 1 — Backend:
```bash
npm run backend
```

Terminal 2 — Frontend:
```bash
npm run dev
```

Open `http://localhost:5173`. Navbar shows **Live API** when backend is connected.

## Production Deployment

### Backend (Render / Railway)

1. Push `backend/` folder to GitHub
2. Create Node.js service
3. Set environment variables:
   - `PORT` = 3001 (or platform default)
   - `NODE_ENV` = production
4. Start command: `node server.js`
5. Run seed once: `npm run seed`

### Database

For production, replace SQLite with PostgreSQL (Supabase/Railway):
- Update `backend/db/database.js` to use `pg` connection
- Run migration SQL from `backend/db/migrations/001_initial.sql`

### Frontend (Vercel)

1. Connect GitHub repo
2. Build command: `npm run build`
3. Output directory: `dist`
4. Environment variable:
   - `VITE_API_URL` = your deployed backend URL

## Environment Variables

| Variable | Location | Purpose |
|----------|----------|---------|
| `PORT` | Backend | Server port (default 3001) |
| `VITE_API_URL` | Frontend | Backend API base URL |
| `DATABASE_URL` | Backend (prod) | PostgreSQL connection string |
