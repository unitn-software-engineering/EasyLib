/**
 * https://www.npmjs.com/package/supertest
 */
import request from 'supertest';
import jwt from 'jsonwebtoken';
import app from './app.js';

test('app module should be defined', () => {
  expect(app).toBeDefined();
});

test('GET / should return 200', () => {
  return request(app)
    .get('/')
    .expect(200);
});
