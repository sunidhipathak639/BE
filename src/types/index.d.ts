import { Request } from 'express';
import { Role } from '@prisma/client';

export interface CustomRequest extends Request {
  user?: {
    id: string;
    role: Role;
  };
}
