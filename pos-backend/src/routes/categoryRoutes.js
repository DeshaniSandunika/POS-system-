import { Router } from 'express';
import { categoryController } from '../controllers/categoryController.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';
import { validate, categoryValidation } from '../utils/validation.js';

const router = Router();

// All routes protected
router.use(authMiddleware);

// Create category (admin only)
router.post('/', adminMiddleware, validate(categoryValidation.create), categoryController.create);

// Get all categories
router.get('/', categoryController.getAll);

// Get category by ID
router.get('/:id', categoryController.getById);

// Update category (admin only)
router.put('/:id', adminMiddleware, validate(categoryValidation.update), categoryController.update);

// Delete category (admin only)
router.delete('/:id', adminMiddleware, categoryController.delete);

export default router;
