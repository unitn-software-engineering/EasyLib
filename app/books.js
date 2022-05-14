const express = require('express');
const router = express.Router();
const Book = require('./models/book'); // get our mongoose model



/**
 * Resource representation based on the following the pattern: 
 * https://cloud.google.com/blog/products/application-development/api-design-why-you-should-use-links-not-keys-to-represent-relationships-in-apis
 */
router.get('', async (req, res) => {
    // https://mongoosejs.com/docs/api.html#model_Model.find
    let books = await Book.find({});
    books = books.map( (book) => {
        return {
            self: '/api/v1/books/' + book.id,
            title: book.title
        };
    });
    res.status(200).json(books);
});

router.get('/:id', async (req, res) => {
    // https://mongoosejs.com/docs/api.html#model_Model.findById
    let book = await Book.findById(req.params.id);
    res.status(200).json({
        self: '/api/v1/books/' + book.id,
        title: book.title
    });
});

router.delete('/:id', async (req, res) => {
    let book = await Book.findById(req.params.id).exec();
    if (!book) {
        res.status(404).send()
        console.log('book not found')
        return;
    }
    await book.deleteOne()
    console.log('book removed')
    res.status(204).send()
});

router.post('', async (req, res) => {

	let book = new Book({
        title: req.body.title
    });
    
	book = await book.save();
    
    let bookId = book.id;

    console.log('Book saved successfully');

    /**
     * Link to the newly created resource is returned in the Location header
     * https://www.restapitutorial.com/lessons/httpmethods.html
     */
    res.location("/api/v1/books/" + bookId).status(201).send();
});


module.exports = router;
