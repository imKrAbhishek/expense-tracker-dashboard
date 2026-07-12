import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import 'express-async-errors'; // lets async route handlers throw without try/catch boilerplate

import authRoutes from './routes/auth.routes.js';
import categoryRoutes from './routes/category.routes.js';
import transactionRoutes from './routes/transaction.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';
import insightRoutes from './routes/insight.routes.js';
import budgetRoutes from './routes/budget.routes.js';
import { errorHandler } from './middleware/errorHandler.js';
import { requireAuth } from './middleware/auth.js';

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(morgan('dev'));

// Basic protection against brute-force / abuse
const apiLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 300 });
app.use('/api', apiLimiter);

app.get('/api/health', (req, res) => res.json({ status: 'ok', timestamp: new Date() }));

// Public
app.use('/api/auth', authRoutes);

// Protected (JWT required beyond this point)
app.use('/api/categories', requireAuth, categoryRoutes);
app.use('/api/transactions', requireAuth, transactionRoutes);
app.use('/api/dashboard', requireAuth, dashboardRoutes);
app.use('/api/insights', requireAuth, insightRoutes);
app.use('/api/budgets', requireAuth, budgetRoutes);

app.use(errorHandler); // must be registered last

export default app;
