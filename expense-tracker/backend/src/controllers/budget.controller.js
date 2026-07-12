import { z } from 'zod';
import { prisma } from '../config/prisma.js';

const budgetSchema = z.object({
  categoryId: z.string().uuid(),
  monthlyLimit: z.number().positive(),
  month: z.number().min(1).max(12),
  year: z.number().min(2000),
});

export async function listBudgets(req, res) {
  const { month, year } = req.query;
  const budgets = await prisma.budget.findMany({
    where: {
      userId: req.userId,
      ...(month && { month: Number(month) }),
      ...(year && { year: Number(year) }),
    },
    include: { category: true },
  });
  res.json(budgets);
}

export async function createBudget(req, res) {
  const data = budgetSchema.parse(req.body);
  const budget = await prisma.budget.upsert({
    where: {
      userId_categoryId_month_year: {
        userId: req.userId,
        categoryId: data.categoryId,
        month: data.month,
        year: data.year,
      },
    },
    update: { monthlyLimit: data.monthlyLimit },
    create: { ...data, userId: req.userId },
  });
  res.status(201).json(budget);
}

export async function updateBudget(req, res) {
  const data = budgetSchema.partial().parse(req.body);
  const updated = await prisma.budget.update({
    where: { id: req.params.id },
    data,
  });
  res.json(updated);
}
