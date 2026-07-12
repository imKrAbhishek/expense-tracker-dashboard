import { prisma } from '../config/prisma.js';

/**
 * Detects likely recurring expenses by grouping transactions with the same
 * merchant name and checking whether they occur on a roughly consistent
 * monthly cadence with a similar amount (subscriptions, rent, utilities, etc).
 *
 * Heuristic (explainable, no ML dependency):
 *  - Group past 6 months of expense transactions by normalized merchant name
 *  - Require >= 2 occurrences
 *  - Require the gap between occurrences to average ~28-32 days (monthly-ish)
 *  - Require amount variance to be low (< 15% of the mean) -> consistent billing
 */
export async function detectRecurringExpenses(userId) {
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const transactions = await prisma.transaction.findMany({
    where: { userId, type: 'EXPENSE', date: { gte: sixMonthsAgo } },
    orderBy: { date: 'asc' },
    include: { category: true },
  });

  const groups = {};
  for (const t of transactions) {
    const key = t.merchantName.trim().toLowerCase();
    (groups[key] ??= []).push(t);
  }

  const recurring = [];

  for (const [merchant, txs] of Object.entries(groups)) {
    if (txs.length < 2) continue;

    const amounts = txs.map((t) => Number(t.amount));
    const mean = amounts.reduce((a, b) => a + b, 0) / amounts.length;
    const variance = amounts.reduce((sum, a) => sum + Math.abs(a - mean), 0) / amounts.length;
    const amountIsStable = variance / mean < 0.15;

    const gaps = [];
    for (let i = 1; i < txs.length; i++) {
      const diffDays = (txs[i].date - txs[i - 1].date) / (1000 * 60 * 60 * 24);
      gaps.push(diffDays);
    }
    const avgGap = gaps.reduce((a, b) => a + b, 0) / gaps.length;
    const isMonthlyCadence = avgGap >= 25 && avgGap <= 35;

    if (amountIsStable && isMonthlyCadence) {
      recurring.push({
        merchantName: txs[txs.length - 1].merchantName,
        category: txs[txs.length - 1].category?.name ?? 'Uncategorized',
        averageAmount: Math.round(mean * 100) / 100,
        occurrences: txs.length,
        lastChargedOn: txs[txs.length - 1].date,
        predictedNextChargeDate: new Date(txs[txs.length - 1].date.getTime() + avgGap * 24 * 60 * 60 * 1000),
      });
    }
  }

  return recurring.sort((a, b) => b.averageAmount - a.averageAmount);
}

/**
 * Forecasts next month's total spend using a weighted moving average of the
 * last 3 months (more recent months weighted higher), plus per-category breakdown.
 * This is intentionally simple/transparent rather than a black-box model —
 * appropriate for an intermediate project and easy to explain in an interview.
 */
export async function forecastNextMonth(userId) {
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
  threeMonthsAgo.setDate(1);

  const transactions = await prisma.transaction.findMany({
    where: { userId, type: 'EXPENSE', date: { gte: threeMonthsAgo } },
    include: { category: true },
  });

  const now = new Date();
  const monthlyTotals = [0, 0, 0]; // [2 months ago, last month, this month-so-far -> excluded from weights]
  const perCategoryByMonth = [{}, {}, {}];

  for (const t of transactions) {
    const monthDiff =
      (now.getFullYear() - t.date.getFullYear()) * 12 + (now.getMonth() - t.date.getMonth());
    const idx = 2 - monthDiff; // 2 = two months ago, ... map into array
    if (idx < 0 || idx > 1) continue; // only use fully completed months (skip current, in-progress month)

    monthlyTotals[idx] += Number(t.amount);
    const catName = t.category?.name ?? 'Uncategorized';
    perCategoryByMonth[idx][catName] = (perCategoryByMonth[idx][catName] || 0) + Number(t.amount);
  }

  // Weighted average across the 2 completed months (weights: older=0.4, newer=0.6)
  const weights = [0.4, 0.6];
  const predictedTotal = monthlyTotals[0] * weights[0] + monthlyTotals[1] * weights[1];

  const allCategories = new Set([...Object.keys(perCategoryByMonth[0]), ...Object.keys(perCategoryByMonth[1])]);
  const perCategoryForecast = [...allCategories].map((name) => {
    const older = perCategoryByMonth[0][name] || 0;
    const newer = perCategoryByMonth[1][name] || 0;
    return { category: name, predictedAmount: Math.round((older * weights[0] + newer * weights[1]) * 100) / 100 };
  });

  return {
    predictedTotalExpense: Math.round(predictedTotal * 100) / 100,
    basedOnMonths: 2,
    perCategoryForecast: perCategoryForecast.sort((a, b) => b.predictedAmount - a.predictedAmount),
  };
}

/**
 * Compares current month-to-date spend per category against that category's
 * budget and flags categories on pace to exceed it.
 */
export async function getBudgetAlerts(userId) {
  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  const budgets = await prisma.budget.findMany({
    where: { userId, month, year },
    include: { category: true },
  });

  if (budgets.length === 0) return [];

  const startOfMonth = new Date(year, month - 1, 1);
  const daysElapsed = Math.max(1, (now - startOfMonth) / (1000 * 60 * 60 * 24));
  const daysInMonth = new Date(year, month, 0).getDate();

  const alerts = [];

  for (const budget of budgets) {
    const spent = await prisma.transaction.aggregate({
      where: { userId, categoryId: budget.categoryId, type: 'EXPENSE', date: { gte: startOfMonth } },
      _sum: { amount: true },
    });

    const spentAmount = Number(spent._sum.amount || 0);
    const limit = Number(budget.monthlyLimit);
    const projectedTotal = (spentAmount / daysElapsed) * daysInMonth; // pace-based projection

    if (projectedTotal > limit) {
      alerts.push({
        category: budget.category.name,
        limit,
        spentSoFar: spentAmount,
        projectedTotal: Math.round(projectedTotal * 100) / 100,
        percentOverBudget: Math.round(((projectedTotal - limit) / limit) * 100),
      });
    }
  }

  return alerts.sort((a, b) => b.percentOverBudget - a.percentOverBudget);
}
