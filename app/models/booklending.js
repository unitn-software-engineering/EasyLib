var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model
module.exports = mongoose.model('Booklending', new Schema({ 
	student: {type: Schema.Types.ObjectId, ref: 'Student'},
	book: {type: Schema.Types.ObjectId, ref: 'Book'}
}));