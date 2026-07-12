import { prisma } from '../config/prisma.js';

// Summary card: totals, income vs expense, month-over-month change
export async function getSummary(req, res) {
  const userId = req.userId;
  const now = new Date();
  const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  const [thisMonthTx, lastMonthTx] = await Promise.all([
    prisma.transaction.findMany({ where: { userId, date: { gte: startOfThisMonth } } }),
    prisma.transaction.findMany({ where: { userId, date: { gte: startOfLastMonth, lt: startOfThisMonth } } }),
  ]);

  const sumByType = (txs, type) =>
    txs.filter((t) => t.type === type).reduce((sum, t) => sum + Number(t.amount), 0);

  const thisMonthExpense = sumByType(thisMonthTx, 'EXPENSE');
  const lastMonthExpense = sumByType(lastMonthTx, 'EXPENSE');
  const pctChange = lastMonthExpense === 0 ? null : ((thisMonthExpense - lastMonthExpense) / lastMonthExpense) * 100;

  res.json({
    totalIncome: sumByType(thisMonthTx, 'INCOME'),
    totalExpense: thisMonthExpense,
    netBalance: sumByType(thisMonthTx, 'INCOME') - thisMonthExpense,
    monthOverMonthChangePct: pctChange,
    transactionCount: thisMonthTx.length,
  });
}

// Pie chart data: expense total grouped by category, current month
export async function getByCategory(req, res) {
  const userId = req.userId;
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const grouped = await prisma.transaction.groupBy({
    by: ['categoryId'],
    where: { userId, type: 'EXPENSE', date: { gte: startOfMonth } },
    _sum: { amount: true },
  });

  const categoryIds = grouped.map((g) => g.categoryId).filter(Boolean);
  const categories = await prisma.category.findMany({ where: { id: { in: categoryIds } } });
  const categoryMap = Object.fromEntries(categories.map((c) => [c.id, c]));

  const result = grouped.map((g) => ({
    categoryId: g.categoryId,
    categoryName: g.categoryId ? categoryMap[g.categoryId]?.name : 'Uncategorized',
    color: g.categoryId ? categoryMap[g.categoryId]?.color : '#9ca3af',
    total: Number(g._sum.amount),
  }));

  res.json(result.sort((a, b) => b.total - a.total));
}

// Line chart data: monthly totals for the last N months (default 12)
export async function getMonthlyTrend(req, res) {
  const userId = req.userId;
  const months = Number(req.query.months) || 12;

  const start = new Date();
  start.setMonth(start.getMonth() - (months - 1));
  start.setDate(1);
  start.setHours(0, 0, 0, 0);

  const transactions = await prisma.transaction.findMany({
    where: { userId, date: { gte: start } },
    select: { amount: true, type: true, date: true },
  });

  // Bucket into YYYY-MM
  const buckets = {};
  for (let i = 0; i < months; i++) {
    const d = new Date(start);
    d.setMonth(d.getMonth() + i);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    buckets[key] = { month: key, income: 0, expense: 0 };
  }

  for (const t of transactions) {
    const key = `${t.date.getFullYear()}-${String(t.date.getMonth() + 1).padStart(2, '0')}`;
    if (!buckets[key]) continue;
    if (t.type === 'EXPENSE') buckets[key].expense += Number(t.amount);
    else buckets[key].income += Number(t.amount);
  }

  res.json(Object.values(buckets));
}
