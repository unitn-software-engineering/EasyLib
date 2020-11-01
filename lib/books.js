const express = require('express');
const router = express.Router();
const db = require('./db.js');



/**
 * Here, resource representation follows the following pattern: 
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



module.exports = router;
