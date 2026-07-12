import { z } from 'zod';
import { suggestCategory } from '../services/category.service.js';
import { detectRecurringExpenses, forecastNextMonth, getBudgetAlerts } from '../services/insight.service.js';

export async function categorize(req, res) {
  const { merchantName } = z.object({ merchantName: z.string().min(1) }).parse(req.body);
  const suggestion = await suggestCategory(req.userId, merchantName);
  res.json({ suggestedCategory: suggestion });
}

export async function recurring(req, res) {
  const result = await detectRecurringExpenses(req.userId);
  res.json(result);
}

export async function forecast(req, res) {
  const result = await forecastNextMonth(req.userId);
  res.json(result);
}

export async function budgetAlerts(req, res) {
  const result = await getBudgetAlerts(req.userId);
  res.json(result);
}
