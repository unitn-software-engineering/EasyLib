require('dotenv').config()
var Books   = require('../app/models/book'); // get our mongoose model



var mongoose    = require('mongoose');
// connect to database
mongoose.connect(process.env.DB_URL, {useNewUrlParser: true, useUnifiedTopology: true})
.then ( async () => {
	console.log("Connected to Database")
	
	// Clear books
	await Books.deleteMany().exec()
	console.log("Books removed")
	
	process.exit();
});



