import fs from 'fs';
import path from 'path';
import Subject from '../models/Subject.js';
import Chapter from '../models/Chapter.js';
import Material from '../models/Material.js';
import { successResponse, errorResponse } from '../utils/response.js';

const deleteFile = (filePath) => {
    if (!filePath) return;
    const absolutePath = path.resolve(filePath); 
    fs.access(absolutePath, fs.constants.F_OK, (err) => {
        if (!err) {
            fs.unlink(absolutePath, (unlinkErr) => {
                if (unlinkErr) console.error(`Failed to delete file: ${absolutePath}`, unlinkErr);
            });
        }
    });
};

export const createSubject = async (req, res, next) => {
    try {
        const { title, description, category } = req.body;
        const thumbnail = req.file ? req.file.path : null;

        const subject = await Subject.create({
            title, description, category, thumbnail
        });

        successResponse(res, 201, 'Subject created successfully', subject);
    } catch (error) {
        if (req.file) deleteFile(req.file.path);
        errorResponse(res, 500, error.message);
    }
};

export const updateSubject = async (req, res, next) => {
    try {
        const { id } = req.params;
        const subject = await Subject.findById(id);

        if (!subject) {
            if (req.file) deleteFile(req.file.path);
            return errorResponse(res, 404, 'Subject not found');
        }

        const dataToUpdate = { ...req.body };
        if (req.file) {
            if (subject.thumbnail) deleteFile(subject.thumbnail);
            dataToUpdate.thumbnail = req.file.path;
        }

        const updatedSubject = await Subject.findByIdAndUpdate(id, dataToUpdate, { new: true });
        successResponse(res, 200, 'Subject updated successfully', updatedSubject);
    } catch (error) {
        if (req.file) deleteFile(req.file.path);
        errorResponse(res, 500, error.message);
    }
};

export const deleteSubject = async (req, res, next) => {
    try {
        const { id } = req.params;
        const subject = await Subject.findById(id);

        if (!subject) return errorResponse(res, 404, 'Subject not found');
        if (subject.thumbnail) deleteFile(subject.thumbnail);
        
        await Subject.findByIdAndDelete(id);
        successResponse(res, 200, 'Subject deleted successfully');
    } catch (error) {
        errorResponse(res, 500, error.message);
    }
};

export const createChapter = async (req, res) => {
    try {
        const { subjectId, title, grade, order } = req.body;
        const subjectExists = await Subject.exists({ _id: subjectId });
        if (!subjectExists) return errorResponse(res, 404, 'Related Subject not found');

        const chapter = await Chapter.create({ subjectId, title, grade, order });
        successResponse(res, 201, 'Chapter created successfully', chapter);
    } catch (error) {
        errorResponse(res, 500, error.message);
    }
};

export const updateChapter = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedChapter = await Chapter.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedChapter) return errorResponse(res, 404, 'Chapter not found');
        successResponse(res, 200, 'Chapter updated successfully', updatedChapter);
    } catch (error) {
        errorResponse(res, 500, error.message);
    }
};

export const deleteChapter = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedChapter = await Chapter.findByIdAndDelete(id);
        if (!deletedChapter) return errorResponse(res, 404, 'Chapter not found');
        successResponse(res, 200, 'Chapter deleted successfully');
    } catch (error) {
        errorResponse(res, 500, error.message);
    }
};

export const createMaterial = async (req, res, next) => {
    try {
        const { chapterId, title, type, contentUrl } = req.body;

        let finalContent = contentUrl;
        if (req.file) {
            finalContent = req.file.path; 
        }

        if (!finalContent) {
            return errorResponse(res, 400, 'File Material or URL is required');
        }

        const isDownloadable = type !== 'video'; 

        const material = await Material.create({
            chapterId,
            title,
            type, 
            contentUrl: finalContent,
            isDownloadable
        });

        successResponse(res, 201, 'Material created successfully', material);
    } catch (error) {
        if (req.file) deleteFile(req.file.path);
        console.log(error)
        errorResponse(res, 500, error.message);
    }
};

export const updateMaterial = async (req, res, next) => {
    try {
        const { id } = req.params;
        const material = await Material.findById(id);

        if (!material) {
            if (req.file) deleteFile(req.file.path);
            return errorResponse(res, 404, 'Material not found');
        }

        let dataToUpdate = { ...req.body };

        if (req.file) {
            if (material.contentUrl && !material.contentUrl.startsWith('http')) {
                deleteFile(material.contentUrl);
            }
            dataToUpdate.contentUrl = req.file.path;
        }

        if (dataToUpdate.type) {
            dataToUpdate.isDownloadable = dataToUpdate.type !== 'video';
        }

        const updatedMaterial = await Material.findByIdAndUpdate(id, dataToUpdate, { new: true });
        successResponse(res, 200, 'Material updated successfully', updatedMaterial);
    } catch (error) {
        if (req.file) deleteFile(req.file.path);
        errorResponse(res, 500, error.message);
    }
};

export const deleteMaterial = async (req, res, next) => {
    try {
        const { id } = req.params;
        const material = await Material.findById(id);

        if (!material) return errorResponse(res, 404, 'Material not found');

        if (material.contentUrl && !material.contentUrl.startsWith('http')) {
            deleteFile(material.contentUrl);
        }

        await Material.findByIdAndDelete(id);
        successResponse(res, 200, 'Material deleted successfully');
    } catch (error) {
        errorResponse(res, 500, error.message);
    }
};