import Subject from '../models/Subject.js';
import Chapter from '../models/Chapter.js';
import Material from '../models/Material.js';
import UserProgress from '../models/UserProgress.js';
import mongoose from 'mongoose';
import { successResponse, errorResponse } from '../utils/response.js';

export const getSubjects = async (req, res) => {
    try {
        const { keyword, category } = req.query;
        let query = {};
        if (keyword) query.title = { $regex: keyword, $options: 'i' };
        if (category) query.category = category;

        const subjects = await Subject.find(query).lean();

        const subjectsWithProgress = await Promise.all(subjects.map(async (subject) => {
            const chapters = await Chapter.find({ subjectId: subject._id });
            const chapterIds = chapters.map(c => c._id);

            const totalMaterials = await Material.countDocuments({ chapterId: { $in: chapterIds } });

            const userCompleted = await UserProgress.find({ userId: req.user._id }).select('materialId');
            const userCompletedIds = userCompleted.map(uc => uc.materialId.toString());

            const materials = await Material.find({ chapterId: { $in: chapterIds } }).select('_id');
            const subjectMaterialIds = materials.map(m => m._id.toString());

            const completedCount = subjectMaterialIds.filter(id => userCompletedIds.includes(id)).length;

            const progressPercentage = totalMaterials === 0 ? 0 : Math.round((completedCount / totalMaterials) * 100);

            return {
                ...subject,
                grade: chapters[0]?.grade || 10,
                progress: progressPercentage,
                totalMaterials,
                completedMaterials: completedCount
            };
        }));

        successResponse(res, 200, 'Subjects retrieved', subjectsWithProgress);
    } catch (error) {
        errorResponse(res, 500, error.message);
    }
};

export const getSubjectDetail = async (req, res) => {
    try {
        const { id } = req.params;
        const subject = await Subject.findById(id).lean();
        if(!subject) return errorResponse(res, 404, 'Subject not found');

        const chapters = await Chapter.find({ subjectId: id }).sort({ grade: 1, order: 1 }).lean();

        const chaptersWithData = await Promise.all(chapters.map(async (chapter) => {
            const materials = await Material.find({ chapterId: chapter._id }).lean();
            
            const materialsWithStatus = await Promise.all(materials.map(async (mat) => {
                const isCompleted = await UserProgress.exists({ userId: req.user._id, materialId: mat._id });
                const isBookmarked = await mongoose.model('Bookmark').exists({ userId: req.user._id, materialId: mat._id });
                return { 
                    ...mat, 
                    isCompleted: !!isCompleted,
                    isBookmarked: !!isBookmarked
                };
            }));

            const total = materialsWithStatus.length;
            const completed = materialsWithStatus.filter(m => m.isCompleted).length;
            const progress = total === 0 ? 0 : Math.round((completed / total) * 100);

            return {
                ...chapter,
                progress, 
                materials: materialsWithStatus
            };
        }));

        const grouped = {
            10: chaptersWithData.filter(c => c.grade === 10),
            11: chaptersWithData.filter(c => c.grade === 11),
            12: chaptersWithData.filter(c => c.grade === 12),
        };

        successResponse(res, 200, 'Subject detail retrieved', {
            subject,
            grades: grouped,
            grade: chaptersWithData[0]?.grade || 10
        });

    } catch (error) {
        errorResponse(res, 500, error.message);
    }
};