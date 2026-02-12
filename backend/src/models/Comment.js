import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    chapterId: { type: mongoose.Schema.Types.ObjectId, ref: 'Chapter', required: true }, 
    content: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model('Comment', commentSchema);