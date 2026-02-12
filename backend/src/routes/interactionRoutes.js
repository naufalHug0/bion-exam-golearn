import express from 'express';
import { markComplete, toggleBookmark, getMyBookmarks, postComment, getComments, getLeaderboard } from '../controllers/interactionController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/progress', protect, markComplete);
router.post('/bookmark', protect, toggleBookmark);
router.get('/bookmark', protect, getMyBookmarks);

router.post('/comment', protect, postComment);
router.get('/comment/:chapterId', protect, getComments);

router.get('/leaderboard', protect, getLeaderboard);

export default router;