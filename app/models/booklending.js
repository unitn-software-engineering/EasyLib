var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model
module.exports = mongoose.model('Booklending', new Schema({ 
	studentId: String,
	bookId: String
}));