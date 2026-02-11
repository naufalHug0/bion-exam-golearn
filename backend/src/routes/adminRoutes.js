import express from 'express';
import { 
    createSubject, updateSubject, deleteSubject,
    createChapter, updateChapter, deleteChapter,
    createMaterial, updateMaterial, deleteMaterial 
} from '../controllers/adminController.js';

import { uploadSubject, uploadMaterial } from '../middleware/uploadMiddleware.js';

const router = express.Router();

// SUBJECTS
router.post('/subjects', uploadSubject.single('thumbnail'), createSubject);
router.put('/subjects/:id', uploadSubject.single('thumbnail'), updateSubject);
router.delete('/subjects/:id', deleteSubject);

// CHAPTERS
router.post('/chapters', createChapter);
router.put('/chapters/:id', updateChapter);
router.delete('/chapters/:id', deleteChapter);

// MATERIALS
// Endpoint ini sekarang support upload file video besar (MP4/MKV/AVI)
router.post('/materials', uploadMaterial.single('file'), createMaterial);
router.put('/materials/:id', uploadMaterial.single('file'), updateMaterial);
router.delete('/materials/:id', deleteMaterial);

export default router;