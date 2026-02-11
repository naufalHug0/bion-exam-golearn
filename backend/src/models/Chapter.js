import mongoose from 'mongoose';

const chapterSchema = new mongoose.Schema({
    subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
    title: { type: String, required: true }, 
    grade: { type: Number, enum: [10, 11, 12], required: true },
    order: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model('Chapter', chapterSchema);