import express from 'express';
import Book from './models/book.js'; // get our mongoose model
const router = express.Router();



/**
 * Resource representation based on the following the pattern: 
 * https://cloud.google.com/blog/products/application-development/api-design-why-you-should-use-links-not-keys-to-represent-relationships-in-apis
 */
router.get('', async (req, res) => {
    const filter = {};
    if (req.query.title) {
        filter.title = { $regex: req.query.title, $options: 'i' };
    }
    if (req.query.author) {
        filter.author = { $regex: req.query.author, $options: 'i' };
    }

    // https://mongoosejs.com/docs/api.html#model_Model.find
    let books = await Book.find(filter);
    books = books.map( (book) => {
        return {
            self: '/api/v1/books/' + book.id,
            title: book.title,
            author: book.author || '',
            isbn: book.isbn || '',
            genre: book.genre || '',
            year: book.year
        };
    });
    res.status(200).json(books);
});

router.use('/:id', async (req, res, next) => {
    // https://mongoosejs.com/docs/api.html#model_Model.findById
    let book = await Book.findById(req.params.id).exec();
    if (!book) {
        res.status(404).send()
        console.log('book not found')
        return;
    }
    req['book'] = book;
    next()
});

router.get('/:id', async (req, res) => {
    let book = req['book'];
    res.status(200).json({
        self: '/api/v1/books/' + book.id,
        title: book.title,
        author: book.author || '',
        isbn: book.isbn || '',
        genre: book.genre || '',
        year: book.year
    });
});

router.delete('/:id', async (req, res) => {
    let book = req['book'];
    await Book.deleteOne({ _id: req.params.id });
    console.log('book removed')
    res.status(204).send()
});

router.post('', async (req, res) => {
    if (!req.body.title || typeof req.body.title !== 'string' || !req.body.title.trim()) {
        return res.status(400).json({ error: 'The field "title" is required and must be a non-empty string' });
    }

	let book = new Book({
        title: req.body.title.trim(),
        author: req.body.author ? String(req.body.author).trim() : '',
        isbn: req.body.isbn ? String(req.body.isbn).trim() : '',
        genre: req.body.genre ? String(req.body.genre).trim() : '',
        year: req.body.year ? Number(req.body.year) : undefined
    });
    
	book = await book.save();
    
    let bookId = book._id;

    console.log('Book saved successfully');

    /**
     * Link to the newly created resource is returned in the Location header
     * https://www.restapitutorial.com/lessons/httpmethods.html
     */
    res.location("/api/v1/books/" + bookId).status(201).send();
});


export default router;
