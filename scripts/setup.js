require('dotenv').config()
var Student   = require('../app/models/student'); // get our mongoose model

var mongoose    = require('mongoose');
// connect to database
mongoose.connect(process.env.DB_URL, {useNewUrlParser: true, useUnifiedTopology: true})
.then ( () => {
	console.log("Connected to Database")
});

// Clear users
Student.remove().then( () => {
	var marco = new Student({ 
		email: 'marco@unitn.com',
		password: '123'
	});
	return marco.save();
}).then( () => {
	console.log('User marco@unitn.com saved successfully');
}).then( () => {
	var mario = new Student({ 
		email: 'mario.rossi@unitn.com',
		password: '123'
	});
	return mario.save();
}).then( () => {
	console.log('User mario.rossi@unitn.com saved successfully');
	process.exit();
});
