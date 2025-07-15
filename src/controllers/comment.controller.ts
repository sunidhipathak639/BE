import { Request, Response } from 'express';
import prisma from '../config/db';
import { CustomRequest } from '../types';

// Create Comment
export const createComment = async (req: CustomRequest, res: Response) => {
  const { content, taskId } = req.body;
  const authorId = req.user?.id;

  if (!authorId) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const comment = await prisma.comment.create({
      data: {
        content,
        taskId,
        authorId,
      },
    });
    res.status(201).json(comment);
  } catch (err) {
    console.error('Create Comment Error:', err);
    res.status(500).json({ message: 'Failed to create comment' });
  }
};

// Get All Comments
export const getComments = async (_req: Request, res: Response) => {
  try {
    const comments = await prisma.comment.findMany({
      include: {
        author: true,
        task: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    res.status(200).json(comments);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch comments' });
  }
};

// Get Comments by Task ID
export const getCommentsByTask = async (req: Request, res: Response) => {
  const { taskId } = req.params;

  try {
    const comments = await prisma.comment.findMany({
      where: { taskId },
      include: { author: true },
      orderBy: { createdAt: 'asc' },
    });
    res.status(200).json(comments);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch comments for task' });
  }
};

// Get Comment by ID
export const getCommentById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const comment = await prisma.comment.findUnique({
      where: { id },
      include: { author: true, task: true },
    });
    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    res.status(200).json(comment);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch comment' });
  }
};

// Update Comment
export const updateComment = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { content } = req.body;

  try {
    const updated = await prisma.comment.update({
      where: { id },
      data: { content },
    });
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update comment' });
  }
};

// Delete Comment
export const deleteComment = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await prisma.comment.delete({ where: { id } });
    res.json({ message: 'Comment deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete comment' });
  }
};
