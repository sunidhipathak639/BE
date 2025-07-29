import { Request, Response } from 'express';
import prisma from '../config/db';
import { getCache, setCache, deleteCache } from '../utils/redisCache';
import { CustomRequest } from '../types';

export const getAllProjects = async (req: CustomRequest, res: Response) => {
  const userId = req.user?.id;
  const userRole = req.user?.role;
  const cacheKey = `projects:user:${userId}`;

  try {
    const cached = await getCache(cacheKey);
    if (cached) {
      return res.status(200).json(cached);
    }

    let projects;

    if (userRole === 'ADMIN' || userRole === 'PROJECT_MANAGER' || userRole === 'DEVELOPER' || userRole === 'TESTER' || userRole === 'VIEWER') {
      // ADMIN or PROJECT_MANAGER can see all projects and tasks
      projects = await prisma.project.findMany({
        include: {
          tasks: true, // Get all tasks for all projects
        },
        orderBy: { createdAt: 'desc' },
      });
    } else {
      // For non-ADMIN users, show only projects they created and tasks assigned to them or created by them
      projects = await prisma.project.findMany({
        where: {
          createdById: userId, // Show only projects created by the user
        },
        include: {
          tasks: {
            where: {
              OR: [
                { assignedToId: userId }, // Tasks assigned to the user
                { createdById: userId },   // Tasks created by the user
              ],
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
    }

    await setCache(cacheKey, projects, 3600); // Cache the data for 1 hour
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
