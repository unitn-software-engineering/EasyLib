import mongoose from 'mongoose';
const { Schema } = mongoose;

export default mongoose.model('Booklending', new Schema({ 
	student: {type: Schema.Types.ObjectId, ref: 'Student'},
	book: {type: Schema.Types.ObjectId, ref: 'Book'}
}));