import { Request, Response } from 'express';
import prisma from '../config/db';
import { CustomRequest } from '../types';
import { getCache, setCache, deleteCache } from '../utils/redisCache';
// ✅ Create Notification
export const createNotification = async (req: CustomRequest, res: Response) => {
  const { content, recipientId } = req.body; // Extract content and recipientId from the request body
  const io = req.app.get('io'); // Accessing the Socket.io instance

  try {
    // Create the notification in the database
    const notification = await prisma.notification.create({
      data: {
        content,
        recipientId,
      },
    });

    // Emit the notification to the recipient via Socket.io
    io.emit('new_notification', {
      recipientId,
      notification,
    });

    // Invalidate Redis cache for this user
    await deleteCache(`notifications:user:${recipientId}`);

    res.status(201).json(notification);
  } catch (err) {
    console.error('Create Notification Error:', err);
    res.status(500).json({ message: 'Failed to create notification' });
  }
};


// ✅ Get All Notifications for logged-in user
export const getNotifications = async (req: CustomRequest, res: Response) => {
  const userId = req.user?.id;

  if (!userId) return res.status(401).json({ message: 'Unauthorized' });

  try {
    // Disable caching for this route to force fetching fresh data
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');

    const notifications = await prisma.notification.findMany({
      where: { recipientId: userId },
      orderBy: { createdAt: 'desc' },
    });

    res.json(notifications);
  } catch (err) {
    console.error('Get Notifications Error:', err);
    res.status(500).json({ message: 'Failed to fetch notifications' });
  }
};

// ✅ Mark Notification as Read
export const markNotificationAsRead = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const updated = await prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });

    // Invalidate Redis cache
    await deleteCache(`notifications:user:${updated.recipientId}`);

    res.json(updated);
  } catch (err) {
    console.error('Mark as Read Error:', err);
    res.status(500).json({ message: 'Failed to update notification' });
  }
};

// ✅ Delete Notification
export const deleteNotification = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const deleted = await prisma.notification.delete({
      where: { id },
    });

    // Invalidate Redis cache
    await deleteCache(`notifications:user:${deleted.recipientId}`);

    res.json({ message: 'Notification deleted' });
  } catch (err) {
    console.error('Delete Notification Error:', err);
    res.status(500).json({ message: 'Failed to delete notification' });
  }
};

// ✅ Get Notifications by User ID (with Redis Caching)
export const getNotificationsByUser = async (req: Request, res: Response) => {
  const { userId } = req.params;

  const cacheKey = `notifications:user:${userId}`;

  try {
    // Check Redis Cache first
    const cached = await getCache(cacheKey);
    if (cached) {
      return res.status(200).json(cached);
    }

    const notifications = await prisma.notification.findMany({
      where: { recipientId: userId },
      orderBy: { createdAt: 'desc' },
    });

    // Save to Redis
    await setCache(cacheKey, notifications, 3600); // cache for 1 hour

    res.status(200).json(notifications);
  } catch (err) {
    console.error('Get Notifications By User Error:', err);
    res.status(500).json({ message: 'Failed to fetch notifications' });
  }
};
