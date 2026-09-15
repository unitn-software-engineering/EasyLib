import mongoose from 'mongoose';
const { Schema } = mongoose;

export default mongoose.model('Booklending', new Schema({ 
	student: {type: Schema.Types.ObjectId, ref: 'Student', required: true},
	book: {type: Schema.Types.ObjectId, ref: 'Book', required: true},
	start_date: { type: Date, default: Date.now },
	end_date: { type: Date, required: true },
	status: { type: String, enum: ['active', 'returned'], default: 'active' },
	returnedAt: { type: Date }
}));
