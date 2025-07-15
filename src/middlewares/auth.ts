import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { CustomRequest } from '../types';

export function authenticate(req: CustomRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized: Missing or invalid token format' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = verifyToken(token) as { id: string; role: any };
    req.user = {
      id: decoded.id,
      role: decoded.role,
    };
    next();
  } catch (error) {
    console.error('Auth error:', error);
    return res.status(403).json({ message: 'Unauthorized: Invalid token' });
  }
}
