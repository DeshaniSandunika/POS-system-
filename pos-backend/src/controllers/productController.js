import { PrismaClient } from '@prisma/client';
import { sendSuccess, sendError } from '../utils/response.js';

const prisma = new PrismaClient();

export const productController = {
  // Create product
  create: async (req, res) => {
    try {
      const { name, description, price, quantity, categoryId } = req.body;

      // Check if category exists
      const category = await prisma.category.findUnique({ where: { id: categoryId } });
      if (!category) {
        return sendError(res, 'Category not found', null, 404);
      }

      const product = await prisma.product.create({
        data: {
          name,
          description: description || null,
          price: parseFloat(price),
          quantity: quantity || 0,
          categoryId,
        },
        include: {
          category: true,
        },
      });

      return sendSuccess(res, 'Product created successfully', product, 201);
    } catch (error) {
      return sendError(res, 'Error creating product', error.message, 500);
    }
  },

  // Get all products
  getAll: async (req, res) => {
    try {
      const products = await prisma.product.findMany({
        include: {
          category: true,
        },
      });

      return sendSuccess(res, 'Products retrieved successfully', products);
    } catch (error) {
      return sendError(res, 'Error retrieving products', error.message, 500);
    }
  },

  // Get product by ID
  getById: async (req, res) => {
    try {
      const { id } = req.params;

      const product = await prisma.product.findUnique({
        where: { id },
        include: {
          category: true,
        },
      });

      if (!product) {
        return sendError(res, 'Product not found', null, 404);
      }

      return sendSuccess(res, 'Product retrieved successfully', product);
    } catch (error) {
      return sendError(res, 'Error retrieving product', error.message, 500);
    }
  },

  // Update product
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, description, price, quantity, categoryId } = req.body;

      // Check if product exists
      const product = await prisma.product.findUnique({ where: { id } });
      if (!product) {
        return sendError(res, 'Product not found', null, 404);
      }

      // Check if category exists if provided
      if (categoryId) {
        const category = await prisma.category.findUnique({ where: { id: categoryId } });
        if (!category) {
          return sendError(res, 'Category not found', null, 404);
        }
      }

      const updatedProduct = await prisma.product.update({
        where: { id },
        data: {
          ...(name && { name }),
          ...(description !== undefined && { description }),
          ...(price && { price: parseFloat(price) }),
          ...(quantity !== undefined && { quantity }),
          ...(categoryId && { categoryId }),
        },
        include: {
          category: true,
        },
      });

      return sendSuccess(res, 'Product updated successfully', updatedProduct);
    } catch (error) {
      return sendError(res, 'Error updating product', error.message, 500);
    }
  },

  // Delete product
  delete: async (req, res) => {
    try {
      const { id } = req.params;

      // Check if product exists
      const product = await prisma.product.findUnique({ where: { id } });
      if (!product) {
        return sendError(res, 'Product not found', null, 404);
      }

      await prisma.product.delete({ where: { id } });

      return sendSuccess(res, 'Product deleted successfully');
    } catch (error) {
      if (error.code === 'P2003') {
        return sendError(res, 'Cannot delete product with associated orders', null, 400);
      }
      return sendError(res, 'Error deleting product', error.message, 500);
    }
  },
};
