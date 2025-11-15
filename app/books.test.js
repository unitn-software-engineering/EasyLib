/**
 * https://www.npmjs.com/package/supertest
 */
import { expect } from 'chai';
import sinon from 'sinon';
import request from 'supertest';
import app from './app.js';
import Book from './models/book.js';

describe('GET /api/v1/books', () => {

  // Mocking Book.find method
  let bookSpy;
  // Mocking Book.findById method
  let bookSpyFindById;

  before(() => {
    bookSpy = sinon.stub(Book, 'find').returns([{
      id: 1010,
      title: 'Software Engineering 2'
    }]);
    
    bookSpyFindById = sinon.stub(Book, 'findById').callsFake((id) => {
      return {
        exec: () => {
          if (id == 1010)
            return {
              id: 1010,
              title: 'Software Engineering 2'
            };
          else
            return null;
        }
      };
    });
  });

  after(() => {
    bookSpy.restore();
    bookSpyFindById.restore();
  });
  
  it('GET /api/v1/books should respond with an array of books', (done) => {
    request(app)
      .get('/api/v1/books')
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        if (res.body && res.body[0]) {
          expect(res.body[0]).to.deep.equal({
            self: '/api/v1/books/1010',
            title: 'Software Engineering 2'
          });
        }
        done();
      });
  });

  
  it('GET /api/v1/books/:id should respond with json', (done) => {
    request(app)
      .get('/api/v1/books/1010')
      .expect('Content-Type', /json/)
      .expect(200, {
          self: '/api/v1/books/1010',
          title: 'Software Engineering 2'
        }, done);
  });

});
