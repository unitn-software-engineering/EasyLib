import mongoose from 'mongoose';
const { Schema } = mongoose;

export default mongoose.model('Student', new Schema({ 
	email: String,
	password: String
}));