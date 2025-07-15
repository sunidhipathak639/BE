import express from 'express';
import {
  createNotification,
  getNotifications,
  markNotificationAsRead,
  deleteNotification,
  getNotificationsByUser
} from '../controllers/notification.controller';
import { authenticate } from '../middlewares/auth';

const router = express.Router();

router.post('/', authenticate, createNotification);
router.get('/', authenticate, getNotifications);
router.put('/:id/read', authenticate, markNotificationAsRead);
router.delete('/:id', authenticate, deleteNotification);
router.get('/', authenticate, getNotificationsByUser);
export default router;
