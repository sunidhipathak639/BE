import { Request, Response } from "express";
import prisma from "../config/db";
import { CustomRequest } from "../types";
import { getPaginatedTasks } from '../services/task.service';

// Create Task
export const createTask = async (req: CustomRequest, res: Response) => {
  const { title, description, status, projectId, assignedToId } = req.body;
  const createdById = req.user?.id;

  if (!createdById) {
    return res.status(401).json({ message: "Unauthorized: Missing user info" });
  }

  try {
    const task = await prisma.task.create({
      data: {
        title,
        description,
        status,
        projectId,
        assignedToId,
        createdById,
      },
    });

    res.status(201).json(task);
  } catch (err) {
    console.error("Create Task Error:", err);
    res.status(500).json({ message: "Failed to create task" });
  }
};

// Get All Tasks (Paginated)
export const getTasks = async (req: Request, res: Response) => {
  try {
    const { page = '1', limit = '10', search = '' } = req.query;

    const result = await getPaginatedTasks({
      page: parseInt(page as string),
      limit: parseInt(limit as string),
      search: search as string,
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch tasks', error: err });
  }
};

// Get Task by ID
export const getTaskById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const task = await prisma.task.findUnique({
      where: { id },
      include: {
        assignedTo: true,
        createdBy: true,
        project: true,
      },
    });

    if (!task) return res.status(404).json({ message: "Task not found" });

    res.status(200).json(task);
  } catch (err) {
    console.error("Get Task By ID Error:", err);
    res.status(500).json({ message: "Failed to fetch task" });
  }
};

// Update Task
export const updateTask = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, description, status, assignedToId } = req.body;

  try {
    const updatedTask = await prisma.task.update({
      where: { id },
      data: {
        title,
        description,
        status,
        assignedToId,
      },
    });

    res.status(200).json(updatedTask);
  } catch (err) {
    console.error("Update Task Error:", err);
    res.status(500).json({ message: "Failed to update task" });
  }
};

// Delete Task
export const deleteTask = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await prisma.task.delete({ where: { id } });
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (err) {
    console.error("Delete Task Error:", err);
    res.status(500).json({ message: "Failed to delete task" });
  }
};

// Get Tasks by Project ID
export const getTasksByProject = async (req: Request, res: Response) => {
  const { projectId } = req.params;

  try {
    const tasks = await prisma.task.findMany({
      where: { projectId },
      include: {
        assignedTo: true,
        createdBy: true,
      },
    });

    res.status(200).json(tasks);
  } catch (err) {
    console.error("Get Tasks By Project Error:", err);
    res.status(500).json({ message: "Failed to fetch tasks for project" });
  }
};

// Assign Task to a User
export const assignTaskToUser = async (req: CustomRequest, res: Response) => {
  const { taskId } = req.params;
  const { assignedToId } = req.body;
  const userRole = req.user?.role;

  if (!userRole || !['ADMIN', 'PROJECT_MANAGER'].includes(userRole)) {
    return res.status(403).json({ message: "Forbidden: Insufficient permissions" });
  }

  try {
    const task = await prisma.task.findUnique({ where: { id: taskId } });
    if (!task) return res.status(404).json({ message: "Task not found" });

    const user = await prisma.user.findFirst({
      where: { id: assignedToId, isDeleted: false },
    });
    if (!user) return res.status(404).json({ message: "User to assign not found" });

    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: { assignedToId },
    });

    res.status(200).json({
      message: "Task assigned successfully",
      task: updatedTask,
    });
  } catch (err) {
    console.error("Assign Task Error:", err);
    res.status(500).json({ message: "Failed to assign task" });
  }
};

export const getAssignedTasksPaginated = async (req: CustomRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { page = '1', limit = '10', search = '' } = req.query;

    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);

    const [total, tasks] = await Promise.all([
      prisma.task.count({
        where: {
          assignedToId: userId,
          title: { contains: search as string, mode: 'insensitive' },
        },
      }),
      prisma.task.findMany({
        where: {
          assignedToId: userId,
          title: { contains: search as string, mode: 'insensitive' },
        },
        include: {
          project: true,
          assignedTo: true,
          createdBy: true,
        },
        skip: (pageNum - 1) * limitNum,
        take: limitNum,
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    res.status(200).json({
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
      data: tasks,
    });
  } catch (err) {
    console.error("Get Assigned Tasks Error:", err);
    res.status(500).json({ message: "Failed to fetch assigned tasks" });
  }
};
