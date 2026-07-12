import { prisma } from '../config/prisma.js';

// Default categories + the keywords that drive auto-categorization.
// This is the core of the "smart categorization" feature: a lightweight,
// explainable rule-based classifier. It can later be swapped for an
// embedding-similarity or LLM-based classifier without changing the API contract.
const DEFAULT_CATEGORIES = [
  { name: 'Food & Dining', color: '#f59e0b', icon: '🍔', keywords: ['restaurant', 'cafe', 'coffee', 'starbucks', 'mcdonald', 'doordash', 'ubereats', 'grubhub', 'zomato', 'swiggy'] },
  { name: 'Transportation', color: '#3b82f6', icon: '🚗', keywords: ['uber', 'lyft', 'taxi', 'gas', 'shell', 'chevron', 'parking', 'metro', 'transit'] },
  { name: 'Shopping', color: '#ec4899', icon: '🛍️', keywords: ['amazon', 'walmart', 'target', 'ebay', 'store', 'mall'] },
  { name: 'Subscriptions', color: '#8b5cf6', icon: '📺', keywords: ['netflix', 'spotify', 'hulu', 'disney+', 'youtube premium', 'subscription', 'prime video'] },
  { name: 'Utilities', color: '#10b981', icon: '💡', keywords: ['electric', 'water bill', 'internet', 'comcast', 'verizon', 'at&t', 'utility'] },
  { name: 'Housing', color: '#ef4444', icon: '🏠', keywords: ['rent', 'mortgage', 'landlord', 'apartment'] },
  { name: 'Health', color: '#14b8a6', icon: '💊', keywords: ['pharmacy', 'cvs', 'walgreens', 'doctor', 'hospital', 'clinic', 'gym'] },
  { name: 'Entertainment', color: '#f97316', icon: '🎬', keywords: ['cinema', 'movie', 'concert', 'ticketmaster', 'game'] },
  { name: 'Income', color: '#22c55e', icon: '💰', keywords: ['payroll', 'salary', 'deposit', 'refund'] },
  { name: 'Other', color: '#6b7280', icon: '📦', keywords: [] },
];

export async function seedDefaultCategoriesForUser(userId) {
  for (const def of DEFAULT_CATEGORIES) {
    const category = await prisma.category.create({
      data: {
        name: def.name,
        color: def.color,
        icon: def.icon,
        isDefault: true,
        userId,
        keywords: {
          create: def.keywords.map((k) => ({ keyword: k })),
        },
      },
    });
  }
}

/**
 * Suggests a category for a raw merchant/transaction description string
 * by matching against each user's keyword rules. Case-insensitive substring match,
 * ranked by keyword weight then specificity (longer keyword match wins ties).
 */
export async function suggestCategory(userId, merchantName) {
  const normalized = merchantName.toLowerCase();

  const categories = await prisma.category.findMany({
    where: { userId },
    include: { keywords: true },
  });

  let bestMatch = null;
  let bestScore = 0;

  for (const category of categories) {
    for (const kw of category.keywords) {
      if (normalized.includes(kw.keyword.toLowerCase())) {
        const score = kw.weight * kw.keyword.length; // longer/more-weighted match wins
        if (score > bestScore) {
          bestScore = score;
          bestMatch = category;
        }
      }
    }
  }

  return bestMatch; // null if no rule matched -> frontend falls back to "Other" / manual pick
}
