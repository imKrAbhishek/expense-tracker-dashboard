import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { prisma } from '../config/prisma.js';
import { ApiError } from '../middleware/errorHandler.js';
import { generateAccessToken, generateRefreshToken } from '../services/token.service.js';
import { seedDefaultCategoriesForUser } from '../services/category.service.js';

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export async function register(req, res) {
  const { name, email, password } = registerSchema.parse(req.body);

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new ApiError(409, 'An account with this email already exists');

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: { name, email, passwordHash },
  });

  // Give every new user a starter set of categories + keyword rules
  await seedDefaultCategoriesForUser(user.id);

  const accessToken = generateAccessToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  res.status(201).json({
    user: { id: user.id, name: user.name, email: user.email },
    accessToken,
    refreshToken,
  });
}

export async function login(req, res) {
  const { email, password } = loginSchema.parse(req.body);

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new ApiError(401, 'Invalid email or password');

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) throw new ApiError(401, 'Invalid email or password');

  const accessToken = generateAccessToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  res.json({
    user: { id: user.id, name: user.name, email: user.email },
    accessToken,
    refreshToken,
  });
}

export async function refresh(req, res) {
  const { refreshToken } = req.body;
  if (!refreshToken) throw new ApiError(400, 'refreshToken is required');

  try {
    const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const accessToken = generateAccessToken(payload.sub);
    res.json({ accessToken });
  } catch {
    throw new ApiError(401, 'Invalid or expired refresh token');
  }
}

export async function logout(req, res) {
  // With stateless JWTs, logout is handled client-side (discard tokens).
  // For production, consider a token blocklist (Redis) for the refresh token.
  res.json({ message: 'Logged out' });
}
