const express = require('express');
const router = express.Router();
const db = require('./db.js');



/**
 * Resource representation based on the following the pattern: 
 * https://cloud.google.com/blog/products/application-development/api-design-why-you-should-use-links-not-keys-to-represent-relationships-in-apis
 */
router.get('', (req, res) => {
    let books = db.books.all().map( (book) => {
        return {
            self: '/api/v1/books/' + book.id,
            title: book.title
        };
    });
    res.status(200).json(books);
});

router.get('/:id', (req, res) => {
    let book = db.books.findById(req.params.id);
    res.status(200).json({
        self: '/api/v1/books/' + book.id,
        title: book.title
    });
});

router.post('', (req, res) => {
    let book = {
        title: req.body.title
    };
    
    let bookId = db.books.insert(book);

    /**
     * Link to the newly created resource is returned in the Location header
     * https://www.restapitutorial.com/lessons/httpmethods.html
     */
    res.location("/api/v1/books/" + bookId).status(201).send();
});


module.exports = router;
