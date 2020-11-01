const express = require('express');
const router = express.Router();
const db = require('./db.js');



router.post('', (req, res) => {
    let studentUrl = req.body.student;
    let bookUrl = req.body.book;

    if (!studentUrl){
        res.status(400).json({ error: 'Student not specified' });
        return;
    };
    
    if (!bookUrl) {
        res.status(400).json({ error: 'Book not specified' });
        return;
    };
    
    let studentId = bookUrl.substring(bookUrl.lastIndexOf('/') + 1);
    let student = db.students.findById(studentId);

    if(!student) {
        res.status(400).json({ error: 'Student does not exists' });
        return;
    };

    let bookId = bookUrl.substring(bookUrl.lastIndexOf('/') + 1);
    let book = db.books.findById(bookId);
    
    if(!book) {
        res.status(400).json({ error: 'Book does not exists' });
        return; 
    };

    let booklendingsId = db.booklendings.insert({
        studentId: studentId,
        bookId: bookId,
    });
    
    res.location("/api/v1/booklendings/" + studentId).status(201).send();
});



module.exports = router;