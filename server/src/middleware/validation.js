import mongoose from 'mongoose';
import { body, validationResult } from 'express-validator';

// Validate ObjectId format
export const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

// Validate pagination
export const validatePagination = (page, limit) => {
  if (page !== undefined && page !== '') {
    const pageNum = Number(page);
    if (!Number.isInteger(pageNum) || pageNum < 1) {
      return { valid: false, error: 'Page must be an integer greater than or equal to 1' };
    }
  }
  if (limit !== undefined && limit !== '') {
    const limitNum = Number(limit);
    if (!Number.isInteger(limitNum) || limitNum < 1) {
      return { valid: false, error: 'Limit must be an integer greater than or equal to 1' };
    }
  }
  return { valid: true };
};

export const validateNote = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 1, max: 200 })
    .withMessage('Title must be 1-200 characters'),
  body('content').notEmpty().withMessage('Content is required'),
  body('subject')
    .notEmpty()
    .withMessage('Subject is required')
    .custom((val) => isValidObjectId(val))
    .withMessage('Invalid ID format'),
  body('topic').trim().notEmpty().withMessage('Topic is required'),
];

export const validateSubject = [
  body('name').trim().notEmpty().withMessage('Subject name required'),
  body('code').trim().notEmpty().withMessage('Subject code required'),
  body('semester')
    .isInt({ min: 1, max: 8 })
    .withMessage('Semester must be between 1 and 8'),
];

export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array(), message: errors.array()[0]?.msg });
  }
  next();
};

export default {
  isValidObjectId,
  validatePagination,
  validateNote,
  validateSubject,
  handleValidationErrors,
};
