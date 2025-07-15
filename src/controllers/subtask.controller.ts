import { Request, Response } from 'express';
import prisma from '../config/db';
import { CustomRequest } from '../types';

// Create Subtask
export const createSubtask = async (req: CustomRequest, res: Response) => {
  const { title, status, taskId, assignedToId } = req.body;

  try {
    const subtask = await prisma.subtask.create({
      data: {
        title,
        status,
        taskId,
        assignedToId,
      },
    });

    res.status(201).json(subtask);
  } catch (err) {
    console.error('Create Subtask Error:', err);
    res.status(500).json({ message: 'Failed to create subtask' });
  }
};

// Get All Subtasks
export const getSubtasks = async (_req: Request, res: Response) => {
  try {
    const subtasks = await prisma.subtask.findMany({
      include: {
        task: true,
        assignedTo: true,
      },
    });
    res.status(200).json(subtasks);
  } catch (err) {
    console.error('Get Subtasks Error:', err);
    res.status(500).json({ message: 'Failed to fetch subtasks' });
  }
};

// Get Subtask by ID
export const getSubtaskById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const subtask = await prisma.subtask.findUnique({
      where: { id },
      include: {
        task: true,
        assignedTo: true,
      },
    });

    if (!subtask) return res.status(404).json({ message: 'Subtask not found' });

    res.status(200).json(subtask);
  } catch (err) {
    console.error('Get Subtask Error:', err);
    res.status(500).json({ message: 'Failed to fetch subtask' });
  }
};

// Update Subtask
export const updateSubtask = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, status, assignedToId } = req.body;

  try {
    const updatedSubtask = await prisma.subtask.update({
      where: { id },
      data: {
        title,
        status,
        assignedToId,
      },
    });

    res.status(200).json(updatedSubtask);
  } catch (err) {
    console.error('Update Subtask Error:', err);
    res.status(500).json({ message: 'Failed to update subtask' });
  }
};

// Delete Subtask
export const deleteSubtask = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await prisma.subtask.delete({
      where: { id },
    });

    res.status(200).json({ message: 'Subtask deleted successfully' });
  } catch (err) {
    console.error('Delete Subtask Error:', err);
    res.status(500).json({ message: 'Failed to delete subtask' });
  }
};
