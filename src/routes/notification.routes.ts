import express from 'express';
import {
  createNotification,
  getNotificationsByUser,
  markNotificationAsRead,
  deleteNotification,
} from '../controllers/notification.controller';
import { authenticate } from '../middlewares/auth';

const router = express.Router();

router.post('/', authenticate, createNotification);
router.get('/', authenticate, getNotificationsByUser);
router.put('/:id/read', authenticate, markNotificationAsRead);
router.delete('/:id', authenticate, deleteNotification);

export default router;
