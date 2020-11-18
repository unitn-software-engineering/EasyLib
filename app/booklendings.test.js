/**
 * https://www.npmjs.com/package/supertest
 */
const request  = require('supertest');
const app      = require('./app');
const jwt      = require('jsonwebtoken'); // used to create, sign, and verify tokens
const mongoose = require('mongoose');

describe('GET /api/v1/booklendings', () => {

  let connection;

  beforeAll( async () => {
    jest.setTimeout(8000);
    jest.unmock('mongoose');
    connection = await  mongoose.connect(process.env.DB_URL, {useNewUrlParser: true, useUnifiedTopology: true});
    console.log('Database connected!');
    //return connection; // Need to return the Promise db connection?
  });

  afterAll( () => {
    mongoose.connection.close(true);
    console.log("Database connection closed");
  });
  
  // create a valid token
  var token = jwt.sign(
    {email: 'John@mail.com'},
    process.env.SUPER_SECRET,
    {expiresIn: 86400}
  );

  test('POST /api/v1/booklendings with Student not specified', () => {
    return request(app)
      .post('/api/v1/booklendings')
      .set('x-access-token', token)
      .set('Accept', 'application/json')
      .expect(400, { error: 'Student not specified' });
  });
  
  test('POST /api/v1/booklendings with Book not specified', () => {
    return request(app)
      .post('/api/v1/booklendings')
      .set('x-access-token', token)
      .set('Accept', 'application/json')
      .send({ student: 'whatever' }) // sends a JSON post body
      .expect(400, { error: 'Book not specified' });
  });
  
  test('POST /api/v1/booklendings Student does not exist', () => {
    return request(app)
      .post('/api/v1/booklendings')
      .set('x-access-token', token)
      .set('Accept', 'application/json')
      .send({ student: '/api/v1/students/111', book: '/api/v1/books/0' }) // sends a JSON post body
      .expect(400, { error: 'Student does not exist' });
  });
  
  test('POST /api/v1/booklendings Book does not exist', () => {
    return request(app)
      .get('/api/v1/students')
      .expect('Content-Type', /json/)
      .expect(200)
      .then( (res) => {
        return request(app)
          .post('/api/v1/booklendings')
          .set('x-access-token', token)
          .set('Accept', 'application/json')
          .send({ student: res.body[0].self, book: '/api/v1/books/0' }) // sends a JSON post body
          .expect(400, { error: 'Book does not exist' });
      });
  });

});
