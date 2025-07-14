import { Request, Response } from 'express';
import prisma from '../config/db';

export const getAllUsers = async (req: Request, res: Response) => {
  const users = await prisma.user.findMany();
  res.json(users);
};

export const deleteUser = async (req: Request, res: Response) => {
  const { id }:any = req.params;
  await prisma.user.delete({ where: { id } });
  res.json({ message: 'User deleted' });
};
