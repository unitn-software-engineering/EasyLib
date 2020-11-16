const express = require('express');
const app = express();
const mongoose = require('mongoose');

const config = require('./config'); // get our config file


/**
 * Configure mongoose
 */
// mongoose.Promise = global.Promise;
mongoose.connect(config.database.uri, {useNewUrlParser: true, useUnifiedTopology: true})
.then ( () => {
	console.log("Connected to Database")
});


/**
 * Configure secret passcode used by jwt
 */
app.set('superSecret', config.secret); // secret variable


/**
 * Configure Express.js parsing middleware
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


/**
 * Serve front-end static files
 */
app.use('/', express.static('static'));


/**
 * Authentication routing and middleware
 */
const authentication = require('./authentication.js');
app.use('/api/v1/authentications', authentication);

const tokenChecker = require('./tokenChecker.js');
// Protect booklendings endpoint
// access is restricted only to authenticated users
// a valid token must be provided in the request
app.use('/api/v1/booklendings', tokenChecker);



/**
 * Resource routing
 */
const students = require('./students.js');
const books = require('./books.js');
const booklendings = require('./booklendings.js');

app.use('/api/v1/books', books);
app.use('/api/v1/students', students);
app.use('/api/v1/booklendings', booklendings);



/* Default 404 handler */
app.use((req, res) => {
    res.status(404);
    res.json({ error: 'Not found' });
});



module.exports = app;
