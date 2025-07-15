import { Request, Response } from 'express';
import prisma from '../config/db';
import { getCache, setCache, deleteCache } from '../utils/redisCache';
import { CustomRequest } from '../types';

// ✅ Get All Projects (with Redis caching)
export const getAllProjects = async (req: CustomRequest, res: Response) => {
  const userId = req.user?.id;
  const cacheKey = `projects:user:${userId}`;

  try {
    const cached = await getCache(cacheKey);
    if (cached) {
      return res.status(200).json(cached);
    }

    const projects = await prisma.project.findMany({
      where: { createdById: userId },
      include: {
        tasks: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    await setCache(cacheKey, projects, 3600); // cache for 1 hour
    res.status(200).json(projects);
  } catch (err) {
    console.error('Get All Projects Error:', err);
    res.status(500).json({ message: 'Failed to fetch projects' });
  }
};

// ✅ Create Project
export const createProject = async (req: CustomRequest, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { name, description } = req.body;

  try {
    const newProject = await prisma.project.create({
      data: {
        name,
        description,
        createdById: userId, // ✅ Now it's guaranteed to be a string
      },
    });

    await deleteCache(`projects:user:${userId}`);
    res.status(201).json(newProject);
  } catch (err) {
    console.error('Create Project Error:', err);
    res.status(500).json({ message: 'Failed to create project' });
  }
};

// ✅ Update Project
export const updateProject = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, description } = req.body;

  try {
    const updated = await prisma.project.update({
      where: { id },
      data: { name, description },
    });

    await deleteCache(`projects:user:${updated.createdById}`); // Invalidate cache
    res.json(updated);
  } catch (err) {
    console.error('Update Project Error:', err);
    res.status(500).json({ message: 'Failed to update project' });
  }
};

// ✅ Delete Project
export const deleteProject = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const deleted = await prisma.project.delete({ where: { id } });
    await deleteCache(`projects:user:${deleted.createdById}`); // Invalidate cache
    res.json({ message: 'Project deleted' });
  } catch (err) {
    console.error('Delete Project Error:', err);
    res.status(500).json({ message: 'Failed to delete project' });
  }
};
