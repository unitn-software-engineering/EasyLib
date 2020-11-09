const express = require('express');
const router = express.Router();
const db = require('./db.js');



/**
 * Resource representation based on the following the pattern: 
 * https://cloud.google.com/blog/products/application-development/api-design-why-you-should-use-links-not-keys-to-represent-relationships-in-apis
 */
router.get('', (req, res) => {
    let booklendings = db.booklendings.all()
    .filter( (dbEntry) => {
        if( req.query.studentId )
            return dbEntry.studentId == req.query.studentId;
        return true;
    })
    .map( (dbEntry) => {
        return {
            self: '/api/v1/booklendings/' + dbEntry.id,
            student: '/api/v1/students/' + dbEntry.studentId,
            book: '/api/v1/books/' + dbEntry.bookId
        };
    });
    res.status(200).json(booklendings);
});



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
    
    let studentId = studentUrl.substring(studentUrl.lastIndexOf('/') + 1);
    let student = db.students.findById(studentId);

    if(!student) {
        res.status(400).json({ error: 'Student does not exist' });
        return;
    };

    let bookId = bookUrl.substring(bookUrl.lastIndexOf('/') + 1);
    let book = db.books.findById(bookId);
    
    if(!book) {
        res.status(400).json({ error: 'Book does not exist' });
        return; 
    };

    if(db.booklendings.findByBookId(bookId)) {
        res.status(409).json({ error: 'Book already out' });
        return
    }

    let booklendingsId = db.booklendings.insert({
        studentId: studentId,
        bookId: bookId,
    });
    
    res.location("/api/v1/booklendings/" + booklendingsId).status(201).send();
});



module.exports = router;