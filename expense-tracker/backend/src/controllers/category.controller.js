import { z } from 'zod';
import { prisma } from '../config/prisma.js';
import { ApiError } from '../middleware/errorHandler.js';

const categorySchema = z.object({
  name: z.string().min(1),
  color: z.string().optional(),
  icon: z.string().optional(),
});

export async function listCategories(req, res) {
  const categories = await prisma.category.findMany({
    where: { userId: req.userId },
    orderBy: { name: 'asc' },
  });
  res.json(categories);
}

export async function createCategory(req, res) {
  const data = categorySchema.parse(req.body);
  const category = await prisma.category.create({
    data: { ...data, userId: req.userId },
  });
  res.status(201).json(category);
}

export async function updateCategory(req, res) {
  const data = categorySchema.partial().parse(req.body);
  const category = await prisma.category.findFirst({ where: { id: req.params.id, userId: req.userId } });
  if (!category) throw new ApiError(404, 'Category not found');

  const updated = await prisma.category.update({ where: { id: category.id }, data });
  res.json(updated);
}

export async function deleteCategory(req, res) {
  const category = await prisma.category.findFirst({ where: { id: req.params.id, userId: req.userId } });
  if (!category) throw new ApiError(404, 'Category not found');

  await prisma.category.delete({ where: { id: category.id } });
  res.status(204).send();
}
