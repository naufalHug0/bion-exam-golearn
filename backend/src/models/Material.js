import mongoose from 'mongoose';

const materialSchema = new mongoose.Schema({
    chapterId: { type: mongoose.Schema.Types.ObjectId, ref: 'Chapter', required: true },
    title: { type: String, required: true },
    type: { type: String, enum: ['pdf', 'ppt', 'video'], required: true },
    contentUrl: { type: String, required: true }, 
    isDownloadable: { type: Boolean, default: false },
}, { timestamps: true })

materialSchema.pre('save', function() {
    this.isDownloadable = this.type !== 'video';
});

export default mongoose.model('Material', materialSchema);