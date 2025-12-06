import { Router } from 'express';
import { orderController } from '../controllers/orderController.js';
import { authMiddleware } from '../middleware/auth.js';
import { validate, orderValidation } from '../utils/validation.js';

const router = Router();

// All routes protected
router.use(authMiddleware);

// Create order
router.post('/', validate(orderValidation.create), orderController.create);

// Get all orders
router.get('/', orderController.getAll);

// Get order by ID
router.get('/:id', orderController.getById);

// Update order status
router.put('/:id', orderController.updateStatus);

// Delete order
router.delete('/:id', orderController.delete);

export default router;
