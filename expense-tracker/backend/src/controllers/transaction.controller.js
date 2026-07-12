import { z } from 'zod';
import { prisma } from '../config/prisma.js';
import { ApiError } from '../middleware/errorHandler.js';
import { suggestCategory } from '../services/category.service.js';

const transactionSchema = z.object({
  merchantName: z.string().min(1),
  amount: z.number().positive(),
  type: z.enum(['EXPENSE', 'INCOME']).default('EXPENSE'),
  categoryId: z.string().uuid().optional().nullable(),
  note: z.string().optional(),
  date: z.string().datetime().or(z.string()), // accept ISO string or plain date
});

export async function listTransactions(req, res) {
  const { page = 1, limit = 20, categoryId, startDate, endDate, type } = req.query;

  const where = {
    userId: req.userId,
    ...(categoryId && { categoryId }),
    ...(type && { type }),
    ...((startDate || endDate) && {
      date: {
        ...(startDate && { gte: new Date(startDate) }),
        ...(endDate && { lte: new Date(endDate) }),
      },
    }),
  };

  const [transactions, total] = await Promise.all([
    prisma.transaction.findMany({
      where,
      include: { category: true },
      orderBy: { date: 'desc' },
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
    }),
    prisma.transaction.count({ where }),
  ]);

  res.json({ data: transactions, pagination: { page: Number(page), limit: Number(limit), total } });
}

export async function createTransaction(req, res) {
  const body = transactionSchema.parse(req.body);

  // Smart feature: if the client didn't pin a category, auto-suggest one from merchant name
  let categoryId = body.categoryId;
  if (!categoryId) {
    const suggested = await suggestCategory(req.userId, body.merchantName);
    categoryId = suggested?.id ?? null;
  }

  const transaction = await prisma.transaction.create({
    data: {
      userId: req.userId,
      merchantName: body.merchantName,
      amount: body.amount,
      type: body.type,
      note: body.note,
      date: new Date(body.date),
      categoryId,
    },
    include: { category: true },
  });

  res.status(201).json(transaction);
}

export async function updateTransaction(req, res) {
  const body = transactionSchema.partial().parse(req.body);
  const existing = await prisma.transaction.findFirst({ where: { id: req.params.id, userId: req.userId } });
  if (!existing) throw new ApiError(404, 'Transaction not found');

  const updated = await prisma.transaction.update({
    where: { id: existing.id },
    data: { ...body, ...(body.date && { date: new Date(body.date) }) },
    include: { category: true },
  });

  res.json(updated);
}

export async function deleteTransaction(req, res) {
  const existing = await prisma.transaction.findFirst({ where: { id: req.params.id, userId: req.userId } });
  if (!existing) throw new ApiError(404, 'Transaction not found');

  await prisma.transaction.delete({ where: { id: existing.id } });
  res.status(204).send();
}
