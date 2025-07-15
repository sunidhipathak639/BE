// src/services/task.service.ts
import prisma from '../config/db';
import { Prisma } from '@prisma/client';

interface TaskPaginationOptions {
  page: number;
  limit: number;
  search?: string;
}

export const getPaginatedTasks = async ({ page, limit, search }: TaskPaginationOptions) => {
  const where: Prisma.TaskWhereInput = search
    ? {
        OR: [
          {
            title: {
              contains: search,
              mode: Prisma.QueryMode.insensitive,
            },
          },
          {
            description: {
              contains: search,
              mode: Prisma.QueryMode.insensitive,
            },
          },
        ],
      }
    : {};

  const total = await prisma.task.count({ where });

  const tasks = await prisma.task.findMany({
    where,
    skip: (page - 1) * limit,
    take: limit,
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      project: true,
      assignedTo: true,
      createdBy: true,
    },
  });

  return {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
    data: tasks,
  };
};
