/**
 * https://www.npmjs.com/package/supertest
 */
import { expect } from 'chai';
import request from 'supertest';
import app from './app.js';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

describe('GET /api/v1/booklendings', () => {

  let connection;
  let token;

  before(async function() {
    this.timeout(8000);
    connection = await mongoose.connect(process.env.DB_URL);
    console.log('Database connected!');
    
    // create a valid token
    token = jwt.sign(
      {email: 'John@mail.com'},
      process.env.SUPER_SECRET,
      {expiresIn: 86400}
    );
  });

  after(() => {
    mongoose.connection.close(true);
    console.log("Database connection closed");
  });

  it('POST /api/v1/booklendings with Student not specified', (done) => {
    request(app)
      .post('/api/v1/booklendings')
      .set('x-access-token', token)
      .set('Accept', 'application/json')
      .expect(400, { error: 'Student not specified' }, done);
  });
  
  it('POST /api/v1/booklendings with Book not specified', (done) => {
    request(app)
      .post('/api/v1/booklendings')
      .set('x-access-token', token)
      .set('Accept', 'application/json')
      .send({ student: 'whatever' })
      .expect(400, { error: 'Book not specified' }, done);
  });
  
  it('POST /api/v1/booklendings Student does not exist', (done) => {
    request(app)
      .post('/api/v1/booklendings')
      .set('x-access-token', token)
      .set('Accept', 'application/json')
      .send({ student: '/api/v1/students/111', book: '/api/v1/books/0' })
      .expect(400, { error: 'Student does not exist' }, done);
  });
  
  it('POST /api/v1/booklendings Book does not exist', (done) => {
    request(app)
      .get('/api/v1/students')
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        request(app)
          .post('/api/v1/booklendings')
          .set('x-access-token', token)
          .set('Accept', 'application/json')
          .send({ student: res.body[0].self, book: '/api/v1/books/0' })
          .expect(400, { error: 'Book does not exist' }, done);
      });
  });

});
