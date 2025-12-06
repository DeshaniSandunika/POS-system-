import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { sendSuccess, sendError } from '../utils/response';
import { generateToken, JwtPayload } from '../config/jwt';
import { AuthRequest } from '../middleware/auth';

const prisma = new PrismaClient();

export const userController = {
  // Register user
  register: async (req: AuthRequest, res: Response) => {
    try {
      const { email, password, name, role } = req.body;

      // Check if user already exists
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return sendError(res, 'User already exists with this email', null, 400);
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
          role: role || 'user',
        },
      });

      // Generate token
      const payload: JwtPayload = {
        userId: user.id,
        email: user.email,
        role: user.role,
      };
      const token = generateToken(payload);

      return sendSuccess(res, 'User registered successfully', { user: { id: user.id, email: user.email, name: user.name, role: user.role }, token }, 201);
    } catch (error: any) {
      return sendError(res, 'Error registering user', error.message, 500);
    }
  },

  // Login user
  login: async (req: AuthRequest, res: Response) => {
    try {
      const { email, password } = req.body;

      // Validate input
      if (!email || !password) {
        return sendError(res, 'Email and password are required', null, 400);
      }

      if (!email.includes('@')) {
        return sendError(res, 'Invalid email format', null, 400);
      }

      // Find user
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return sendError(res, 'Invalid email or password', null, 401);
      }

      // Compare password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return sendError(res, 'Invalid email or password', null, 401);
      }

      // Generate token
      const payload: JwtPayload = {
        userId: user.id,
        email: user.email,
        role: user.role,
      };
      const token = generateToken(payload);

      return sendSuccess(res, 'Logged in successfully', { user: { id: user.id, email: user.email, name: user.name, role: user.role }, token });
    } catch (error: any) {
      return sendError(res, 'Error logging in', error.message, 500);
    }
  },

  // Get all users (admin only)
  getAll: async (req: AuthRequest, res: Response) => {
    try {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true,
        },
      });

      return sendSuccess(res, 'Users retrieved successfully', users);
    } catch (error: any) {
      return sendError(res, 'Error retrieving users', error.message, 500);
    }
  },

  // Get user by ID
  getById: async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;

      const user = await prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true,
        },
      });

      if (!user) {
        return sendError(res, 'User not found', null, 404);
      }

      return sendSuccess(res, 'User retrieved successfully', user);
    } catch (error: any) {
      return sendError(res, 'Error retrieving user', error.message, 500);
    }
  },

  // Update user
  update: async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const { name, email, role } = req.body;

      // Check if user exists
      const user = await prisma.user.findUnique({ where: { id } });
      if (!user) {
        return sendError(res, 'User not found', null, 404);
      }

      // Check if email is already in use
      if (email && email !== user.email) {
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
          return sendError(res, 'Email already in use', null, 400);
        }
      }

      const updatedUser = await prisma.user.update({
        where: { id },
        data: {
          ...(name && { name }),
          ...(email && { email }),
          ...(role && { role }),
        },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true,
        },
      });

      return sendSuccess(res, 'User updated successfully', updatedUser);
    } catch (error: any) {
      return sendError(res, 'Error updating user', error.message, 500);
    }
  },

  // Delete user
  delete: async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;

      // Check if user exists
      const user = await prisma.user.findUnique({ where: { id } });
      if (!user) {
        return sendError(res, 'User not found', null, 404);
      }

      await prisma.user.delete({ where: { id } });

      return sendSuccess(res, 'User deleted successfully');
    } catch (error: any) {
      return sendError(res, 'Error deleting user', error.message, 500);
    }
  },
};
