/**
 * https://www.npmjs.com/package/supertest
 */
const request  = require('supertest');
const app      = require('./app');
const jwt      = require('jsonwebtoken'); // used to create, sign, and verify tokens
const mongoose = require('mongoose');

describe('GET /api/v1/booklendings', () => {

  beforeAll( async () => {
    jest.setTimeout(10000);
    jest.unmock('mongoose');
    let db = await  mongoose.connect(process.env.DB_URL, {useNewUrlParser: true, useUnifiedTopology: true});
    console.log('Database connected!');
    return db; // Important to return back the db connection Promise!
  });

  afterAll( () => {
    return mongoose.connection.close();
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
  
  // test('POST /api/v1/booklendings Student does not exist', () => {
  //   return request(app)
  //     .post('/api/v1/booklendings')
  //     .set('x-access-token', token)
  //     .set('Accept', 'application/json')
  //     .send({ student: '/api/v1/students/111', book: '/api/v1/books/0' }) // sends a JSON post body
  //     .expect(400, { error: 'Student does not exist' });
  // });

});
