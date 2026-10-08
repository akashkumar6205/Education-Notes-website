import express from 'express';
import * as noteController from '../controllers/notes.controller.js';
import { verifyToken, isAdmin } from '../middleware/auth.js';
import { validateNote, handleValidationErrors } from '../middleware/validation.js';

const router = express.Router();

// Public routes
router.get('/', noteController.getAllNotes);
router.get('/:id', noteController.getNote);

// Admin routes
router.post(
  '/',
  verifyToken,
  isAdmin,
  validateNote,
  handleValidationErrors,
  noteController.createNote
);

router.put(
  '/:id',
  verifyToken,
  isAdmin,
  noteController.updateNote
);

router.delete(
  '/:id',
  verifyToken,
  isAdmin,
  noteController.deleteNote
);

router.patch(
  '/:id/archive',
  verifyToken,
  isAdmin,
  noteController.archiveNote
);

export default router;