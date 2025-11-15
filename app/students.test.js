/**
 * https://www.npmjs.com/package/supertest
 */
import { expect } from 'chai';
import sinon from 'sinon';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import app from './app.js';
import User from './models/student.js';

describe('GET /api/v1/students/me', () => {

  // Mocking User.findOne method
  let userSpy;
  let token;

  before(() => {
    userSpy = sinon.stub(User, 'findOne').returns({
      id: 1212,
      email: 'John@mail.com'
    });

    // create a valid token
    const payload = {
      email: 'John@mail.com'
    };
    const options = {
      expiresIn: 86400 // expires in 24 hours
    };
    token = jwt.sign(payload, process.env.SUPER_SECRET, options);
  });

  after(() => {
    userSpy.restore();
  });
  
  it('GET /api/v1/students/me with no token should return 401', (done) => {
    request(app)
      .get('/api/v1/students/me')
      .expect(401, done);
  });

  it('GET /api/v1/students/me?token=<invalid> should return 403', (done) => {
    request(app)
      .get('/api/v1/students/me?token=123456')
      .expect(403, done);
  });
      
  it('GET /api/v1/students/me?token=<valid> should return 200', (done) => {
    request(app)
      .get('/api/v1/students/me?token=' + token)
      .expect(200, done);
  });

  it('GET /api/v1/students/me?token=<valid> should return user information', (done) => {
    request(app)
      .get('/api/v1/students/me?token=' + token)
      .end((err, res) => {
        if (err) return done(err);
        const user = res.body;
        expect(user).to.not.be.undefined;
        expect(user.email).to.equal('John@mail.com');
        done();
      });
  });
});
