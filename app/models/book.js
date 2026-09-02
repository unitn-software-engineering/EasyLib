import mongoose from 'mongoose';
const { Schema } = mongoose;

export default mongoose.model('Book', new Schema({ 
	title: { type: String, required: true },
	author: { type: String, default: '' },
	isbn: { type: String, default: '' },
	genre: { type: String, default: '' },
	year: { type: Number }
}));