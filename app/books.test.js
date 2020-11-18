/**
 * https://www.npmjs.com/package/supertest
 */
const request = require('supertest');
const app     = require('./app');

describe('GET /api/v1/books', () => {

  // Moking Book.find method
  let bookSpy;
  // Moking Book.findById method
  let bookSpyFindById;

  beforeAll( () => {
    const Book = require('./models/book');
    bookSpy = jest.spyOn(Book, 'find').mockImplementation((criterias) => {
      return [{
        id: 1010,
        title: 'Software Engineering 2'
      }];
    });
    bookSpyFindById = jest.spyOn(Book, 'findById').mockImplementation((id) => {
      if (id==1010)
        return {
          id: 1010,
          title: 'Software Engineering 2'
        };
      else
        return {};
    });
  });

  afterAll(async () => {
    bookSpy.mockRestore();
    bookSpyFindById.mockRestore();
  });
  
  test('GET /api/v1/books should respond with an array of books', async () => {
    return request(app)
      .get('/api/v1/books')
      .expect('Content-Type', /json/)
      .expect(200)
      .then( (res) => {
        if(res.body && res.body[0]) {
          expect(res.body[0]).toEqual({
            self: '/api/v1/books/1010',
            title: 'Software Engineering 2'
          });
        }
      });
  });

  
  test('GET /api/v1/books/:id should respond with json', async () => {
    return request(app)
      .get('/api/v1/books/1010')
      .expect('Content-Type', /json/)
      .expect(200, {
          self: '/api/v1/books/1010',
          title: 'Software Engineering 2'
        });
  });

});
