import mongoose from 'mongoose';
const { Schema } = mongoose;

export default mongoose.model('Student', new Schema({ 
	email: { type: String, required: true, unique: true, lowercase: true, trim: true },
	password: { type: String, required: true },
	role: { type: String, enum: ['user', 'operator'], default: 'user' },
	firstName: { type: String, default: '' },
	lastName: { type: String, default: '' },
	fiscalCode: { type: String, default: '', uppercase: true, trim: true }
}));
