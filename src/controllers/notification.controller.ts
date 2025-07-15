import { Request, Response } from 'express';
import prisma from '../config/db';
import { CustomRequest } from '../types';

// ✅ Create Notification
export const createNotification = async (req: CustomRequest, res: Response) => {
  const { content, recipientId } = req.body;

  try {
    const notification = await prisma.notification.create({
      data: {
        content,
        recipientId,
      },
    });
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
      data: { read: true },
    });

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
    await prisma.notification.delete({ where: { id } });
    res.json({ message: 'Notification deleted' });
  } catch (err) {
    console.error('Delete Notification Error:', err);
    res.status(500).json({ message: 'Failed to delete notification' });
  }
};
