import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { sendSuccess, sendError } from '../utils/response';
import { AuthRequest } from '../middleware/auth';

const prisma = new PrismaClient();

export const categoryController = {
  // Create category
  create: async (req: AuthRequest, res: Response) => {
    try {
      const { name, description } = req.body;

      // Check if category already exists
      const existingCategory = await prisma.category.findUnique({ where: { name } });
      if (existingCategory) {
        return sendError(res, 'Category already exists', null, 400);
      }

      const category = await prisma.category.create({
        data: {
          name,
          description: description || null,
        },
      });

      return sendSuccess(res, 'Category created successfully', category, 201);
    } catch (error: any) {
      return sendError(res, 'Error creating category', error.message, 500);
    }
  },

  // Get all categories
  getAll: async (req: AuthRequest, res: Response) => {
    try {
      const categories = await prisma.category.findMany({
        include: {
          products: true,
        },
      });

      return sendSuccess(res, 'Categories retrieved successfully', categories);
    } catch (error: any) {
      return sendError(res, 'Error retrieving categories', error.message, 500);
    }
  },

  // Get category by ID
  getById: async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;

      const category = await prisma.category.findUnique({
        where: { id },
        include: {
          products: true,
        },
      });

      if (!category) {
        return sendError(res, 'Category not found', null, 404);
      }

      return sendSuccess(res, 'Category retrieved successfully', category);
    } catch (error: any) {
      return sendError(res, 'Error retrieving category', error.message, 500);
    }
  },

  // Update category
  update: async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const { name, description } = req.body;

      // Check if category exists
      const category = await prisma.category.findUnique({ where: { id } });
      if (!category) {
        return sendError(res, 'Category not found', null, 404);
      }

      // Check if new name is already in use
      if (name && name !== category.name) {
        const existingCategory = await prisma.category.findUnique({ where: { name } });
        if (existingCategory) {
          return sendError(res, 'Category name already in use', null, 400);
        }
      }

      const updatedCategory = await prisma.category.update({
        where: { id },
        data: {
          ...(name && { name }),
          ...(description !== undefined && { description }),
        },
      });

      return sendSuccess(res, 'Category updated successfully', updatedCategory);
    } catch (error: any) {
      return sendError(res, 'Error updating category', error.message, 500);
    }
  },

  // Delete category
  delete: async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;

      // Check if category exists
      const category = await prisma.category.findUnique({ where: { id } });
      if (!category) {
        return sendError(res, 'Category not found', null, 404);
      }

      await prisma.category.delete({ where: { id } });

      return sendSuccess(res, 'Category deleted successfully');
    } catch (error: any) {
      if (error.code === 'P2003') {
        return sendError(res, 'Cannot delete category with associated products', null, 400);
      }
      return sendError(res, 'Error deleting category', error.message, 500);
    }
  },
};
