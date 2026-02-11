import mongoose from 'mongoose';

const userProgressSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    materialId: { type: mongoose.Schema.Types.ObjectId, ref: 'Material', required: true },
    isCompleted: { type: Boolean, default: true },
    completedAt: { type: Date, default: Date.now }
}, { timestamps: true });

userProgressSchema.index({ userId: 1, materialId: 1 }, { unique: true });

export default mongoose.model('UserProgress', userProgressSchema);