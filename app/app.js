const express = require('express');
const app = express();

const authentication = require('./authentication.js');
const tokenChecker = require('./tokenChecker.js');

const students = require('./students.js');
const books = require('./books.js');
const booklendings = require('./booklendings.js');


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
app.use('/api/v1/authentications', authentication);

// Protect booklendings endpoint
// access is restricted only to authenticated users
// a valid token must be provided in the request
app.use('/api/v1/booklendings', tokenChecker);
app.use('/api/v1/students/me', tokenChecker);



/**
 * Resource routing
 */

app.use('/api/v1/books', books);
app.use('/api/v1/students', students);
app.use('/api/v1/booklendings', booklendings);



/* Default 404 handler */
app.use((req, res) => {
    res.status(404);
    res.json({ error: 'Not found' });
});



module.exports = app;
