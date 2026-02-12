import User from '../models/User.js';
import UserProgress from '../models/UserProgress.js';
import Bookmark from '../models/Bookmark.js';
import Comment from '../models/Comment.js';
import { successResponse, errorResponse } from '../utils/response.js';


const XP_POINTS = {
    MATERIAL_COMPLETED: 10,
    COMMENT_POSTED: 5
};


export const markComplete = async (req, res) => {
    try {
        const { materialId } = req.body;
        const userId = req.user._id;
        
        
        const existingProgress = await UserProgress.findOne({ userId, materialId });

        if (existingProgress && existingProgress.isCompleted) {
            
            return successResponse(res, 200, 'Material already completed', { xpGained: 0 });
        }

        
        await UserProgress.findOneAndUpdate(
            { userId, materialId },
            { isCompleted: true },
            { upsert: true, new: true }
        );

        
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $inc: { xp: XP_POINTS.MATERIAL_COMPLETED } }, 
            { new: true }
        );

        successResponse(res, 200, 'Material completed! XP Gained.', { 
            xpGained: XP_POINTS.MATERIAL_COMPLETED,
            currentXp: updatedUser.xp 
        });

    } catch (error) {
        errorResponse(res, 500, error.message);
    }
};


export const toggleBookmark = async (req, res) => {
    try {
        const { materialId } = req.body;
        const existing = await Bookmark.findOne({ userId: req.user._id, materialId });

        if (existing) {
            await Bookmark.findByIdAndDelete(existing._id);
            successResponse(res, 200, 'Bookmark removed');
        } else {
            await Bookmark.create({ userId: req.user._id, materialId });
            successResponse(res, 200, 'Bookmark added');
        }
    } catch (error) {
        errorResponse(res, 500, error.message);
    }
};


export const getMyBookmarks = async (req, res) => {
    try {
        const bookmarks = await Bookmark.find({ userId: req.user._id })
            .populate({
                path: 'materialId',
                populate: {
                    path: 'chapterId',
                    populate: { path: 'subjectId', select: 'title' }
                }
            });

        const formatted = bookmarks.map(b => ({
            bookmarkId: b._id,
            material: b.materialId,
            chapter: b.materialId ? b.materialId.chapterId : null,
            subject: (b.materialId && b.materialId.chapterId) ? b.materialId.chapterId.subjectId : null
        }));

        successResponse(res, 200, 'Bookmarks retrieved', formatted);
    } catch (error) {
        errorResponse(res, 500, error.message);
    }
};


export const postComment = async (req, res) => {
    try {
        const { chapterId, content } = req.body;
        
        
        const comment = await Comment.create({
            userId: req.user._id,
            chapterId,
            content
        });
        
        await comment.populate('userId', 'name avatar');

        
        await User.findByIdAndUpdate(
            req.user._id, 
            { $inc: { xp: XP_POINTS.COMMENT_POSTED } }
        );

        successResponse(res, 201, 'Comment added', comment);
    } catch (error) {
        errorResponse(res, 500, error.message);
    }
};

export const getComments = async (req, res) => {
    try {
        const { chapterId } = req.params;
        const comments = await Comment.find({ chapterId })
            .populate('userId', 'name avatar xp') 
            .sort({ createdAt: -1 });

        successResponse(res, 200, 'Comments retrieved', comments);
    } catch (error) {
        errorResponse(res, 500, error.message);
    }
};

export const getLeaderboard = async (req, res) => {
    try {
        const leaderboard = await User.find()
            .select('name avatar xp')
            .sort({ xp: -1 })        
            .limit(5);               

        successResponse(res, 200, 'Leaderboard retrieved successfully', leaderboard);
    } catch (error) {
        errorResponse(res, 500, error.message);
    }
};