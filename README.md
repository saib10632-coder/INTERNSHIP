# Customer Prepaid Travel Wallet System

**Company:** Manivtha Tours & Travels  
**Duration:** 01 June 2026 – 30 June 2026  
**Tech Stack:** React · Vite · Node.js Express · Recharts

A full-stack prepaid travel wallet management system for Manivtha Tours & Travels. Customers load credit into a travel wallet and use it across multiple bookings with auto-deduction — increasing advance cash flow and customer lock-in.

## Features

| Module | Description |
|--------|-------------|
| Dashboard | KPI cards, animated counters, alerts, recent transactions, charts |
| Wallet Entry Form | Create wallets with validation (auto-deduction, status, notes) |
| Wallet Dashboard | Search, filter, sort, paginate, CSV export, health badges |
| Detail & History | Full wallet profile, credit/debit, transaction timeline, PDF export |
| Customer Directory | Browse customers, link to wallets |
| Reports & Analytics | Bar/line charts, health distribution, CSV export |
| Settings | Company profile and notification preferences |
| Backend API | Full CRUD, ledger engine, dashboard/reports endpoints |
| Automated Alerts | Low-balance and critical balance notifications |

## Project Structure

```
├── src/                    # Frontend (React)
│   ├── components/         # UI screens
│   ├── services/api.js     # API client
│   ├── utils/ledgerEngine.js
│   └── data/mockData.js    # Demo fallback data
├── backend/                # Node.js Express API
│   ├── routes/             # API routes
│   ├── services/           # Ledger engine
│   ├── db/                 # SQLite + migrations + seed
│   └── server.js
├── docs/                   # Internship deliverables
└── tests/                  # Test cases & tracker
```

## Quick Start

```bash
# Install everything + seed database
npm run setup

# Terminal 1 — Backend API (port 3001)
npm run backend

# Terminal 2 — Frontend (port 5173)
npm run dev
```

Open **http://localhost:5173**. The navbar shows **Live API** when connected to the backend, or **Demo Mode** with mock data if the backend is offline.

## API Endpoints

See [docs/api-spec.md](docs/api-spec.md) for the full API reference.

| Route | Purpose |
|-------|---------|
| `GET /health` | Health check |
| `GET/POST /api/customer_prepaid_travel_wallet` | Wallet CRUD |
| `POST /api/customer_prepaid_travel_wallet/:id/transact` | Credit/debit |
| `GET /api/dashboard/summary` | Dashboard KPIs |
| `GET /api/reports/summary` | Analytics |

## Build for Production

```bash
npm run build          # Frontend → dist/
npm run backend:start  # Backend production server
```

See [docs/deployment-guide.md](docs/deployment-guide.md) for Vercel + Render deployment steps.

## Team Roles

| Role | Responsibility |
|------|----------------|
| Student 1 — Frontend | Entry Form, Dashboard, Detail View, Reports UI |
| Student 2 — Backend | APIs, ledger engine, database, reports |
| Student 3 — Testing | Test cases, Postman, deployment validation |

## Documentation

- [Problem Statement](docs/problem-statement.md)
- [Abstract](docs/abstract.md)
- [API Spec](docs/api-spec.md)
- [Database Schema](docs/database-schema.md)
- [Deployment Guide](docs/deployment-guide.md)
- [Test Cases](tests/test-cases.md)
