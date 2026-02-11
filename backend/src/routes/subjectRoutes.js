import express from 'express';
import { getSubjects, getSubjectDetail } from '../controllers/subjectController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getSubjects); 
router.get('/:id', protect, getSubjectDetail);

export default router;