import { z } from 'zod';

export const createNotificationSchema = z.object({
  content: z.string().min(1, 'Content is required'),
  recipientId: z.string().uuid('Valid recipientId is required'),
});
