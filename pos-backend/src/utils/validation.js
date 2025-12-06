import { body, validationResult } from 'express-validator';
import { sendError } from './response.js';

export const validate = (validations) => {
  return async (req, res, next) => {
    for (let validation of validations) {
      const result = await validation.run(req);
      if (!result.isEmpty()) {
        break;
      }
    }
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return sendError(res, 'Validation failed', errors.array(), 400);
    }
    next();
  };
};

// User Validations
export const userValidation = {
  register: [
    body('email')
      .isEmail()
      .withMessage('Please provide a valid email'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters'),
    body('name')
      .notEmpty()
      .withMessage('Name is required'),
  ],
  login: [
    body('email')
      .isEmail()
      .withMessage('Please provide a valid email'),
    body('password')
      .notEmpty()
      .withMessage('Password is required'),
  ],
};

// Category Validations
export const categoryValidation = {
  create: [
    body('name')
      .notEmpty()
      .withMessage('Category name is required')
      .isLength({ min: 2 })
      .withMessage('Category name must be at least 2 characters'),
    body('description')
      .optional()
      .isString()
      .withMessage('Description must be a string'),
  ],
  update: [
    body('name')
      .optional()
      .isLength({ min: 2 })
      .withMessage('Category name must be at least 2 characters'),
    body('description')
      .optional()
      .isString()
      .withMessage('Description must be a string'),
  ],
};

// Product Validations
export const productValidation = {
  create: [
    body('name')
      .notEmpty()
      .withMessage('Product name is required')
      .isLength({ min: 2 })
      .withMessage('Product name must be at least 2 characters'),
    body('price')
      .notEmpty()
      .withMessage('Price is required')
      .isFloat({ gt: 0 })
      .withMessage('Price must be greater than 0'),
    body('quantity')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Quantity must be a positive integer'),
    body('categoryId')
      .notEmpty()
      .withMessage('Category ID is required'),
    body('description')
      .optional()
      .isString()
      .withMessage('Description must be a string'),
  ],
  update: [
    body('name')
      .optional()
      .isLength({ min: 2 })
      .withMessage('Product name must be at least 2 characters'),
    body('price')
      .optional()
      .isFloat({ gt: 0 })
      .withMessage('Price must be greater than 0'),
    body('quantity')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Quantity must be a positive integer'),
    body('categoryId')
      .optional()
      .isString()
      .withMessage('Category ID must be a string'),
    body('description')
      .optional()
      .isString()
      .withMessage('Description must be a string'),
  ],
};

// Order Validations
export const orderValidation = {
  create: [
    body('items')
      .isArray({ min: 1 })
      .withMessage('Order must have at least one item'),
    body('items.*.productId')
      .notEmpty()
      .withMessage('Product ID is required for each item'),
    body('items.*.quantity')
      .isInt({ min: 1 })
      .withMessage('Quantity must be at least 1'),
  ],
};
