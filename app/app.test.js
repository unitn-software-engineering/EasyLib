/**
 * https://www.npmjs.com/package/supertest
 */
import { expect } from 'chai';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import app from './app.js';

describe('App', () => {
  it('app module should be defined', () => {
    expect(app).to.not.be.undefined;
  });

  it('GET / should return 200', (done) => {
    request(app)
      .get('/')
      .expect(200, done);
  });
});
