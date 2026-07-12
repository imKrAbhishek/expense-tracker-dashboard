import jwt from 'jsonwebtoken';
import { ApiError } from './errorHandler.js';

export function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    throw new ApiError(401, 'Missing or malformed Authorization header');
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    req.userId = payload.sub;
    next();
  } catch (err) {
    throw new ApiError(401, 'Invalid or expired token');
  }
}
