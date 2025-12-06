import { Router } from 'express';
import { userController } from '../controllers/userController.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';
import { validate, userValidation } from '../utils/validation.js';

const router = Router();

// Public routes
router.post('/register', validate(userValidation.register), userController.register);
router.post('/login', validate(userValidation.login), userController.login);

// Protected routes
router.get('/', authMiddleware, adminMiddleware, userController.getAll);
router.get('/:id', authMiddleware, userController.getById);
router.put('/:id', authMiddleware, adminMiddleware, userController.update);
router.delete('/:id', authMiddleware, adminMiddleware, userController.delete);

export default router;
