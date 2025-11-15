/**
 * https://www.npmjs.com/package/supertest
 */
import { jest } from '@jest/globals';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import app from './app.js';
import User from './models/student.js';

describe('GET /api/v1/students/me', () => {

  // Moking User.findOne method
  let userSpy;

  beforeAll( () => {
    userSpy = jest.spyOn(User, 'findOne').mockImplementation((criterias) => {
      return {
        id: 1212,
        email: 'John@mail.com'
      };
    });
  });

  afterAll(async () => {
    userSpy.mockRestore();
  });
  
  test('GET /api/v1/students/me with no token should return 401', async () => {
    const response = await request(app).get('/api/v1/students/me');
    expect(response.statusCode).toBe(401);
  });

  test('GET /api/v1/students/me?token=<invalid> should return 403', async () => {
    const response = await request(app).get('/api/v1/students/me?token=123456');
    expect(response.statusCode).toBe(403);
  });

  // create a valid token
  var payload = {
    email: 'John@mail.com'
  }
  var options = {
    expiresIn: 86400 // expires in 24 hours
  }
  var token = jwt.sign(payload, process.env.SUPER_SECRET, options);
      
  test('GET /api/v1/students/me?token=<valid> should return 200', async () => {
    expect.assertions(1);
    const response = await request(app).get('/api/v1/students/me?token='+token);
    expect(response.statusCode).toBe(200);
  });

  test('GET /api/v1/students/me?token=<valid> should return user information', async () => {
    expect.assertions(2);
    const response = await request(app).get('/api/v1/students/me?token='+token);
    const user = response.body;
    expect(user).toBeDefined();
    expect(user.email).toBe('John@mail.com');
  });
});
