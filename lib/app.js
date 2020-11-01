const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded());



/**
 * Middleware to manage authentication
 * https://expressjs.com/it/guide/writing-middleware.html
 * https://expressjs.com/it/guide/using-middleware.html
 */
app.use((req, res, next) => {
    req.loggedUser = req.query.user;
    next();
});



/* Moduli per la gestione delle richieste alle API */
const students = require('./students.js');
const books = require('./books.js');
const booklendings = require('./booklendings.js');

app.use('/api/v1/students', students);
app.use('/api/v1/books', books);
app.use('/api/v1/booklendings', booklendings);



/* Default 404 handler */
app.use((req, res) => {
    res.status(404);
    res.json({ error: 'Not found' });
});



module.exports = app;
