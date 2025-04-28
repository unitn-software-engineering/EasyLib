const express = require('express');
const router = express.Router();
const Booklending = require('./models/booklending'); // get our mongoose model
const Student = require('./models/student'); // get our mongoose model
const Book = require('./models/book'); // get our mongoose model



/**
 * Resource representation based on the following the pattern: 
 * https://cloud.google.com/blog/products/application-development/api-design-why-you-should-use-links-not-keys-to-represent-relationships-in-apis
 */
router.get('', async (req, res) => {
    let booklendings;

    const filter = {};
    if ( req.query.studentId )
        filter.student = req.query.studentId;
    
    booklendings = await Booklending
        .find( filter )
        .populate( 'student', '-password -__v' )
        .populate( 'book', '-__v' )
        .exec();

    booklendings = booklendings.map( (dbEntry) => {
        return {
            self: '/api/v1/booklendings/' + dbEntry._id,
            student: {
                self: '/api/v1/students/' + dbEntry.student._id,
                email: dbEntry.student.email
            },
            book: {
                self: '/api/v1/books/' + dbEntry.book._id,
                title: dbEntry.book.title
            }
        };
    });

    res.status(200).json(booklendings);
});



router.post('', async (req, res) => {
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
    let student = null;
    try {
        student = await Student.findById(studentId);
    } catch (error) {
        // This catch CastError when studentId cannot be casted to mongoose ObjectId
        // CastError: Cast to ObjectId failed for value "11" at path "_id" for model "Student"
    }

    if(student == null) {
        res.status(400).json({ error: 'Student does not exist' });
        return;
    };
    
    let bookId = bookUrl.substring(bookUrl.lastIndexOf('/') + 1);
    let book = null;
    try {
        book = await Book.findById(bookId).exec();
    } catch (error) {
        // CastError: Cast to ObjectId failed for value "11" at path "_id" for model "Book"
    }
    
    if(book == null) {
        res.status(400).json({ error: 'Book does not exist' });
        return; 
    };

    if( ( await Booklending.find({book: bookId}).exec() ).length > 0) {
        res.status(409).json({ error: 'Book already out' });
        return
    }
    
	let booklending = new Booklending({
        student: studentId,
        book: bookId,
    });
    
	booklending = await booklending.save();
    
    let booklendingId = booklending.id;
    
    res.location("/api/v1/booklendings/" + booklendingId).status(201).send();
});



router.delete('/:id', async (req, res) => {
    let lending = await Booklending.findById(req.params.id).exec();
    if (!lending) {
        res.status(404).send()
        console.log('lending not found')
        return;
    }
    await lending.deleteOne()
    console.log('lending removed')
    res.status(204).send()
});



module.exports = router;