import { Request, Response } from 'express';
import prisma from '../config/db';
import { CustomRequest } from '../types';

export const createProject = async (req: CustomRequest, res: Response) => {
  const { name, description } = req.body;
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const project = await prisma.project.create({
      data: {
        name,
        description,
        createdById: userId,
      },
    });

    res.status(201).json(project);
  } catch (err) {
    console.error('Create Project Error:', err);
    res.status(500).json({ message: 'Failed to create project' });
  }
};



export const getProjects = async (req: Request, res: Response) => {
  try {
    const projects = await prisma.project.findMany({
      include: { createdBy: true },
    });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch projects' });
  }
};

export const getProjectById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const project = await prisma.project.findUnique({ where: { id } });
    if (!project) return res.status(404).json({ message: 'Project not found' });

    res.json(project);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching project' });
  }
};

export const updateProject = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, description } = req.body;

  try {
    const project = await prisma.project.update({
      where: { id },
      data: { name, description },
    });

    res.json(project);
  } catch (err) {
    res.status(500).json({ message: 'Error updating project' });
  }
};

export const deleteProject = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await prisma.project.delete({ where: { id } });
    res.json({ message: 'Project deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting project' });
  }
};
