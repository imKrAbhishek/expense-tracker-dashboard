# 💰 Expense Tracker Dashboard

![React](https://img.shields.io/badge/Frontend-React-blue?style=for-the-badge&logo=react)
![Node.js](https://img.shields.io/badge/Backend-Node.js-green?style=for-the-badge&logo=nodedotjs)
![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-336791?style=for-the-badge&logo=postgresql)
![Prisma](https://img.shields.io/badge/ORM-Prisma-2D3748?style=for-the-badge&logo=prisma)

Expense Tracker Dashboard is a full-stack personal finance management application built using the **PERN Stack** (PostgreSQL, Express.js, React, Node.js). The platform helps users manage expenses, monitor budgets, visualize spending trends, and gain smart financial insights through intelligent analytics.

---

## ✨ Features

- 🔐 JWT Authentication with Access & Refresh Tokens
- 💳 Income & Expense Management
- 📊 Interactive Dashboard with Charts
- 📈 Monthly Spending Trend Analysis
- 🥧 Category-wise Expense Distribution
- 🎯 Budget Management & Alerts
- 🤖 Smart Expense Auto-Categorization
- 🔁 Recurring Expense Detection
- 📉 Expense Forecasting using Weighted Moving Average
- ⚡ Responsive UI built with Tailwind CSS

---

# 🛠 Tech Stack

### Frontend
- React (Vite)
- Tailwind CSS
- TanStack React Query
- Recharts

### Backend
- Node.js
- Express.js
- Prisma ORM
- Zod Validation
- JWT Authentication

### Database
- PostgreSQL

---

# 🚀 Project Roadmap

## Phase 1 — Database & Environment Setup

- Install PostgreSQL or create a cloud database (Supabase / Neon / Railway)
- Configure Prisma
- Create database schema
- Run database migrations
- Verify schema using Prisma Studio

## Phase 2 — Backend Development

- JWT Authentication
- User Registration & Login
- Categories CRUD
- Transactions CRUD
- Dashboard Analytics APIs
- Budget APIs
- Smart Insights APIs

## Phase 3 — Frontend Development

- Authentication Pages
- Dashboard Layout
- API Integration
- Axios Client
- React Query Setup

## Phase 4 — Dashboard Components

- Summary Cards
- Category Pie Chart
- Monthly Trend Chart
- Insights Panel
- Transaction Management

## Phase 5 — Smart Features

- Rule-based Auto Categorization
- Recurring Expense Detection
- Budget Alert System
- Expense Forecasting

## Phase 6 — Deployment

- Backend Deployment
- Frontend Deployment
- Environment Configuration
- Production Testing

---

# ⚙️ Local Setup

## Clone Repository

```bash
git clone https://github.com/imKrAbhishek/expense-tracker-dashboard.git
cd expense-tracker-dashboard
```

## Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside the backend folder.

```env
DATABASE_URL=your_database_url
JWT_ACCESS_SECRET=your_secret
JWT_REFRESH_SECRET=your_secret
```

Generate secure JWT secrets:

```bash
openssl rand -hex 32
```

Run migrations:

```bash
npx prisma migrate dev --name init
npx prisma studio
```

Start backend:

```bash
npm run dev
```

Backend runs on:

```
http://localhost:4000
```

---

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

```
http://localhost:5173
```

---

# 📁 Project Structure

```text
backend/
│
├── prisma/
│   └── schema.prisma
│
├── src/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   ├── services/
│   ├── app.js
│   └── server.js
│
frontend/
│
└── src/
    ├── api/
    ├── components/
    ├── pages/
    ├── App.jsx
    └── main.jsx
```

---

# 👨‍💻 Developer

**Abhishek Kumar**

GitHub: **https://github.com/imKrAbhishek**

A software engineering student passionate about Full Stack Development, Backend Engineering, and Artificial Intelligence. I enjoy building scalable web applications using the MERN/PERN stack and solving real-world problems through software development.