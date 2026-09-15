import 'dotenv/config';
import mongoose from 'mongoose';
import Book from '../app/models/book.js';

const books = [
    { title: 'Clean Code', author: 'Robert C. Martin', isbn: '9780132350884', genre: 'Software Engineering', year: 2008 },
    { title: 'The Pragmatic Programmer', author: 'David Thomas, Andrew Hunt', isbn: '9780135957059', genre: 'Software Engineering', year: 2019 },
    { title: 'Design Patterns', author: 'Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides', isbn: '9780201633610', genre: 'Software Engineering', year: 1994 },
    { title: 'Introduction to Algorithms', author: 'Thomas H. Cormen, Charles E. Leiserson, Ronald L. Rivest, Clifford Stein', isbn: '9780262046305', genre: 'Computer Science', year: 2022 },
    { title: 'The Mythical Man-Month', author: 'Frederick P. Brooks Jr.', isbn: '9780201835953', genre: 'Software Engineering', year: 1995 },
    { title: 'Refactoring', author: 'Martin Fowler', isbn: '9780134757599', genre: 'Software Engineering', year: 2018 },
    { title: 'Artificial Intelligence: A Modern Approach', author: 'Stuart Russell, Peter Norvig', isbn: '9780134610993', genre: 'Artificial Intelligence', year: 2021 },
    { title: 'The Design of Everyday Things', author: 'Don Norman', isbn: '9780465050659', genre: 'Design', year: 2013 },
    { title: '1984', author: 'George Orwell', isbn: '9780451524935', genre: 'Dystopian Fiction', year: 1949 },
    { title: 'The Hobbit', author: 'J. R. R. Tolkien', isbn: '9780547928227', genre: 'Fantasy', year: 1937 }
];

if (!process.env.DB_URL) {
    console.error('DB_URL is required');
    process.exit(1);
}

try {
    await mongoose.connect(process.env.DB_URL);
    let inserted = 0;
    let alreadyPresent = 0;

    for (const book of books) {
        const result = await Book.updateOne({ isbn: book.isbn }, { $setOnInsert: book }, { upsert: true }).exec();
        if (result.upsertedCount === 1) inserted += 1;
        else alreadyPresent += 1;
    }

    console.log(`Book seed completed: ${inserted} inserted, ${alreadyPresent} already present.`);
} finally {
    await mongoose.disconnect();
}
