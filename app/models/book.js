import mongoose from 'mongoose';
const { Schema } = mongoose;

export default mongoose.model('Book', new Schema({ 
	title: String
}));