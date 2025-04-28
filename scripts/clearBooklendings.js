require('dotenv').config()
var Booklending = require('../app/models/booklending'); // get our mongoose model
var mongoose = require('mongoose');

// connect to database
mongoose.connect(process.env.DB_URL, {useNewUrlParser: true, useUnifiedTopology: true})
.then ( async () => {
	console.log("Connected to Database")
	
	// Clear books
	await Booklending.deleteMany().exec()
	console.log("Booklending removed")
	
	process.exit();
});



