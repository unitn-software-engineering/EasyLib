import mongoose from 'mongoose';
const { Schema } = mongoose;

export default mongoose.model('Notification', new Schema({
    student: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
    type: { type: String, enum: ['loan_created', 'loan_returned', 'loan_extended'], required: true },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
}));
