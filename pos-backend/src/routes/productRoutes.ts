import { Router } from 'express';
import { productController } from '../controllers/productController';
import { authMiddleware, adminMiddleware } from '../middleware/auth';
import { validate, productValidation } from '../utils/validation';

const router = Router();

// All routes protected
router.use(authMiddleware);

// Create product (admin only)
router.post('/', adminMiddleware, validate(productValidation.create), productController.create);

// Get all products
router.get('/', productController.getAll);

// Get product by ID
router.get('/:id', productController.getById);

// Update product (admin only)
router.put('/:id', adminMiddleware, validate(productValidation.update), productController.update);

// Delete product (admin only)
router.delete('/:id', adminMiddleware, productController.delete);

export default router;
