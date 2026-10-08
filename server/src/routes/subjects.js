import express from 'express';
import * as subjectController from '../controllers/subjectController.js';
import { verifyToken, isAdmin } from '../middleware/auth.js';
import { validateSubject, handleValidationErrors } from '../middleware/validation.js';

const router = express.Router();

router.get('/', subjectController.getAllSubjects);
router.get('/semester/:semester', subjectController.getSubjectsBySemester);

router.post(
  '/',
  verifyToken,
  isAdmin,
  validateSubject,
  handleValidationErrors,
  subjectController.createSubject
);

router.put(
  '/:id',
  verifyToken,
  isAdmin,
  subjectController.updateSubject
);

router.delete(
  '/:id',
  verifyToken,
  isAdmin,
  subjectController.deleteSubject
);

export default router;