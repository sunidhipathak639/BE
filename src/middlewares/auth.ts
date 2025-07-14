import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { CustomRequest } from '../types';

export function authenticate(req: CustomRequest, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Token missing' });

  try {
    const decoded = verifyToken(token) as any;
    req.user = { id: decoded.id, role: decoded.role };
    next();
  } catch {
    return res.status(403).json({ message: 'Invalid token' });
  }
}
