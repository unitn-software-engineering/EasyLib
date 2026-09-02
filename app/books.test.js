/**
 * https://www.npmjs.com/package/supertest
 */
import { jest } from '@jest/globals';
import request from 'supertest';
import app from './app.js';
import Book from './models/book.js';

describe('Books API endpoints', () => {

  let bookFindSpy;
  let bookFindByIdSpy;
  let bookSaveSpy;

  const mockBook = {
    id: '1010',
    _id: '1010',
    title: 'Software Engineering 2',
    author: 'Ian Sommerville',
    isbn: '978-0133943030',
    genre: 'Computer Science',
    year: 2020,
    save: jest.fn().mockImplementation(function() {
      return Promise.resolve(this);
    })
  };

  beforeAll(() => {
    bookFindSpy = jest.spyOn(Book, 'find').mockImplementation((criteria) => {
      if (criteria && criteria.title && criteria.title.$regex === 'NonExistent') {
        return Promise.resolve([]);
      }
      return Promise.resolve([mockBook]);
    });

    bookFindByIdSpy = jest.spyOn(Book, 'findById').mockImplementation((id) => {
      return {
        exec: () => {
          if (id === '1010') {
            return Promise.resolve(mockBook);
          }
          return Promise.resolve(null);
        }
      };
    });
  });

  afterAll(async () => {
    bookFindSpy.mockRestore();
    bookFindByIdSpy.mockRestore();
  });

  test('GET /api/v1/books should respond with an array of books with detailed metadata', async () => {
    const res = await request(app)
      .get('/api/v1/books')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0]).toEqual({
      self: '/api/v1/books/1010',
      title: 'Software Engineering 2',
      author: 'Ian Sommerville',
      isbn: '978-0133943030',
      genre: 'Computer Science',
      year: 2020
    });
  });

  test('GET /api/v1/books?title=Software should filter books by title', async () => {
    const res = await request(app)
      .get('/api/v1/books?title=Software')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(res.body.length).toBe(1);
    expect(res.body[0].title).toBe('Software Engineering 2');
  });

  test('GET /api/v1/books/:id should respond with json of the book', async () => {
    const res = await request(app)
      .get('/api/v1/books/1010')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(res.body).toEqual({
      self: '/api/v1/books/1010',
      title: 'Software Engineering 2',
      author: 'Ian Sommerville',
      isbn: '978-0133943030',
      genre: 'Computer Science',
      year: 2020
    });
  });

  test('GET /api/v1/books/:id with invalid ID should return 404', async () => {
    await request(app)
      .get('/api/v1/books/9999')
      .expect(404);
  });

  test('POST /api/v1/books with missing title should return 400 Bad Request', async () => {
    const res = await request(app)
      .post('/api/v1/books')
      .send({ author: 'Ian Sommerville' })
      .expect(400);

    expect(res.body.error).toBeDefined();
  });

  test('POST /api/v1/books with valid body should create a book and return 201 with Location', async () => {
    const saveMock = jest.spyOn(Book.prototype, 'save').mockImplementation(function() {
      return Promise.resolve(this);
    });

    const res = await request(app)
      .post('/api/v1/books')
      .send({
        title: 'Clean Code',
        author: 'Robert C. Martin',
        isbn: '978-0132350884',
        genre: 'Software Engineering',
        year: 2008
      })
      .expect(201);

    expect(res.headers.location).toMatch(/\/api\/v1\/books\/[a-f0-9]+/);
    saveMock.mockRestore();
  });

});
