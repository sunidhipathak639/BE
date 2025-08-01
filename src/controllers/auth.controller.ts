import { Request, Response } from 'express';
import prisma from '../config/db';
import bcrypt from 'bcryptjs';
import { generateToken } from '../utils/jwt';

export const register = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required' });
  }

  try {
    // Check if there's any user in the database
    const existingUser = await prisma.user.findFirst();

    // If no users exist, create an Admin user
    if (!existingUser) {
      const adminPassword = 'password'; // Default password for admin
      const hashedPassword = await bcrypt.hash(adminPassword, 10); // Hash the password

      const adminUser = await prisma.user.create({
        data: {
          name: 'Admin',
          email: 'admin@sunidhi.com', // Admin email
          password: hashedPassword,
          role: 'ADMIN', // Set role to Admin
        },
      });

      return res.status(201).json({
        message: 'Admin user created successfully.',
        user: { id: adminUser.id, name: adminUser.name, email: adminUser.email, role: adminUser.role },
      });
    }

    // If the admin user already exists, ensure they have the 'ADMIN' role
    const adminUser = await prisma.user.findUnique({ where: { email: 'admin@sunidhi.com' } });

    if (adminUser && adminUser.role !== 'ADMIN') {
      // If the role is not ADMIN, update the role to ADMIN
      await prisma.user.update({
        where: { email: 'admin@sunidhi.com' },
        data: { role: 'ADMIN' },
      });
    }

    // If user exists, check if regular user already exists
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(400).json({ message: 'User already exists' });

    // Proceed with regular user registration
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    res.status(201).json({ message: 'User created', user });
  } catch (error: any) {
    console.error('Register Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password required' });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = generateToken({ id: user.id, role: user.role });

    res.status(200).json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
