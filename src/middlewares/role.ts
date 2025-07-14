import { Request, Response, NextFunction } from 'express';
import { CustomRequest } from '../types';

export function authorizeRoles(...allowedRoles: string[]) {
  return (req: CustomRequest, res: Response, next: NextFunction) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    next();
  };
}
