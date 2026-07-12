# 💰 Expense Tracker Dashboard

A full-stack **Expense Tracker Dashboard** built with the **PERN Stack** (PostgreSQL, Express.js, React, Node.js). The application enables users to manage personal finances through interactive dashboards, budget tracking, expense categorization, and intelligent spending insights.

---

# 🚀 Tech Stack

### Frontend

* React (Vite)
* Tailwind CSS
* Recharts
* TanStack React Query

### Backend

* Node.js
* Express.js
* Prisma ORM
* Zod Validation
* JWT Authentication

### Database

* PostgreSQL

### Smart Features

* Rule-based expense auto-categorization
* Recurring expense detection
* Weighted Moving Average expense forecasting
* Pace-based budget alerts

---

# 📋 Implementation Roadmap

## Phase 1 — Database & Environment Setup

1. Install PostgreSQL locally or create a free cloud database (Supabase, Neon, or Railway).
2. Install backend dependencies.
3. Configure environment variables.
4. Generate the Prisma schema.
5. Run database migrations.
6. Verify the database using Prisma Studio.

### Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file from `.env.example` and configure:

```env
DATABASE_URL=your_database_url
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
```

Generate secure JWT secrets:

```bash
openssl rand -hex 32
```

Run Prisma:

```bash
npx prisma migrate dev --name init
npx prisma studio
```

---

## Phase 2 — Backend API

Develop the following modules:

* JWT Authentication (Register, Login, Refresh Token)
* Password hashing using Bcrypt
* Category CRUD APIs
* Default category seeding during signup
* Transaction CRUD APIs
* Pagination and filtering
* Automatic expense categorization
* Dashboard analytics APIs
* Smart Insights APIs
* Budget CRUD APIs
* API testing using Postman or Thunder Client

---

## Phase 3 — Frontend Foundation

Install frontend dependencies:

```bash
cd frontend
npm install
```

Build:

* Tailwind CSS configuration
* React Router
* React Query Provider
* Axios client with automatic token refresh
* Login and Registration pages
* Authentication flow

---

## Phase 4 — Dashboard UI

Develop the dashboard components:

### Summary Cards

Displays:

* Total Income
* Total Expense
* Current Balance
* Number of Transactions
* Month-over-Month Percentage Change

### Category Pie Chart

Uses:

```
GET /dashboard/by-category
```

Implemented using **Recharts PieChart**.

### Monthly Trend Chart

Uses:

```
GET /dashboard/monthly-trend
```

Implemented using **Recharts LineChart**.

### Insights Panel

Displays:

* Expense Forecast
* Budget Alerts
* Recurring Expenses

### Transaction Management

Build:

* Transaction Table
* Add Transaction Form
* Edit/Delete Transaction
* Pagination
* Filters

---

## Phase 5 — Smart Features

### Auto Categorization

A keyword-based classification engine assigns expenses to categories.

Features:

* Default categories created during signup
* Keyword-weight scoring
* Easily replaceable with embeddings or LLM classification while keeping the same API contract.

Endpoint:

```
POST /insights/categorize
```

---

### Recurring Expense Detection

Groups expenses by merchant and identifies recurring payments based on:

* 25–35 day intervals
* Less than 15% amount variation

---

### Expense Forecasting

Uses a **Weighted Moving Average** based on the previous two completed months.

Weight Distribution:

* Previous Month → 60%
* Two Months Ago → 40%

Forecasts are generated category-wise.

---

### Budget Alerts

Projects month-end spending based on current spending pace and identifies categories likely to exceed their budgets.

---

## Phase 6 — Deployment & Polish

Final improvements include:

* Loading states
* Error handling
* Empty state components
* Frontend validation matching Zod schemas
* Backend deployment
* Frontend deployment
* Production environment configuration

### Optional Enhancements

* CSV Import
* Dark Mode
* Multi-Currency Support
* Family Budgets
* Monthly Email Reports

---

# ▶️ Running Locally

## Backend

```bash
cd backend
npm install
cp .env.example .env

# Configure environment variables

npx prisma migrate dev --name init
npm run dev
```

Backend runs at:

```
http://localhost:4000
```

---

## Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at:

```
http://localhost:5173
```

---

# 📁 Project Structure

```
backend/
│
├── src/
│   ├── config/
│   │   └── prisma.js
│   │
│   ├── controllers/
│   │   ├── auth
│   │   ├── category
│   │   ├── transaction
│   │   ├── dashboard
│   │   ├── insight
│   │   └── budget
│   │
│   ├── middleware/
│   │   ├── auth.js
│   │   └── errorHandler.js
│   │
│   ├── routes/
│   ├── services/
│   │   ├── category.service.js
│   │   └── insight.service.js
│   │
│   ├── app.js
│   └── server.js
│
└── prisma/
    └── schema.prisma

frontend/
│
└── src/
    ├── api/
    ├── components/
    │   ├── SummaryCards
    │   ├── CategoryPieChart
    │   ├── MonthlyTrendChart
    │   └── InsightsPanel
    │
    ├── pages/
    │   └── Dashboard.jsx
    │
    ├── App.jsx
    └── main.jsx
```
