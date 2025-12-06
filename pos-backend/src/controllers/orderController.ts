import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { sendSuccess, sendError } from '../utils/response';
import { AuthRequest } from '../middleware/auth';

const prisma = new PrismaClient();

// Generate unique order number
const generateOrderNumber = async (): Promise<string> => {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `ORD-${timestamp}-${random}`;
};

export const orderController = {
  // Create order
  create: async (req: AuthRequest, res: Response) => {
    try {
      const { items } = req.body;

      if (!items || items.length === 0) {
        return sendError(res, 'Order must have at least one item', null, 400);
      }

      // Calculate total and validate products
      let totalAmount = 0;
      const orderItems = [];

      for (const item of items) {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
        });

        if (!product) {
          return sendError(res, `Product with ID ${item.productId} not found`, null, 404);
        }

        if (product.quantity < item.quantity) {
          return sendError(
            res,
            `Insufficient stock for product ${product.name}. Available: ${product.quantity}`,
            null,
            400
          );
        }

        const itemTotal = product.price * item.quantity;
        totalAmount += itemTotal;

        orderItems.push({
          productId: item.productId,
          quantity: item.quantity,
          price: product.price,
        });
      }

      // Create order with items
      const orderNumber = await generateOrderNumber();
      const order = await prisma.order.create({
        data: {
          orderNumber,
          totalAmount,
          items: {
            create: orderItems,
          },
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      });

      // Update product quantities
      for (const item of items) {
        await prisma.product.update({
          where: { id: item.productId },
          data: {
            quantity: {
              decrement: item.quantity,
            },
          },
        });
      }

      return sendSuccess(res, 'Order created successfully', order, 201);
    } catch (error: any) {
      return sendError(res, 'Error creating order', error.message, 500);
    }
  },

  // Get all orders
  getAll: async (req: AuthRequest, res: Response) => {
    try {
      const orders = await prisma.order.findMany({
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return sendSuccess(res, 'Orders retrieved successfully', orders);
    } catch (error: any) {
      return sendError(res, 'Error retrieving orders', error.message, 500);
    }
  },

  // Get order by ID
  getById: async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;

      const order = await prisma.order.findUnique({
        where: { id },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      });

      if (!order) {
        return sendError(res, 'Order not found', null, 404);
      }

      return sendSuccess(res, 'Order retrieved successfully', order);
    } catch (error: any) {
      return sendError(res, 'Error retrieving order', error.message, 500);
    }
  },

  // Update order status
  updateStatus: async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const validStatuses = ['pending', 'completed', 'cancelled'];
      if (!validStatuses.includes(status)) {
        return sendError(res, `Invalid status. Must be one of: ${validStatuses.join(', ')}`, null, 400);
      }

      // Check if order exists
      const order = await prisma.order.findUnique({ where: { id } });
      if (!order) {
        return sendError(res, 'Order not found', null, 404);
      }

      const updatedOrder = await prisma.order.update({
        where: { id },
        data: { status },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      });

      return sendSuccess(res, 'Order status updated successfully', updatedOrder);
    } catch (error: any) {
      return sendError(res, 'Error updating order', error.message, 500);
    }
  },

  // Delete order
  delete: async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;

      // Check if order exists
      const order = await prisma.order.findUnique({
        where: { id },
        include: {
          items: true,
        },
      });

      if (!order) {
        return sendError(res, 'Order not found', null, 404);
      }

      // Restore product quantities
      for (const item of order.items) {
        await prisma.product.update({
          where: { id: item.productId },
          data: {
            quantity: {
              increment: item.quantity,
            },
          },
        });
      }

      // Delete order
      await prisma.order.delete({ where: { id } });

      return sendSuccess(res, 'Order deleted successfully');
    } catch (error: any) {
      return sendError(res, 'Error deleting order', error.message, 500);
    }
  },
};
