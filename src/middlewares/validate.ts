import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

export const validate =
  (schema: ZodSchema<any>) => (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const errors = result.error.format();
      return res.status(400).json({ success: false, errors });
    }

    // ✅ Attach parsed data to req.body if needed
    req.body = result.data;
    next();
  };
