const request = require('supertest');
const jwt     = require('jsonwebtoken'); // used to create, sign, and verify tokens
const config  = require('./config'); // get our config file
const app     = require('./app');

test('app module should be defined', () => {
  expect(app).toBeDefined();
});

test('GET / should return 200', async () => {
  const response = await request(app).get('/');
  expect(response.statusCode).toBe(200);
});

describe('Protected API /api/v1/users/me', () => {

  // Moking User.findOne method
  let userSpy;

  beforeAll(() => {
    const User = require('./app/models/user');
    userSpy = jest.spyOn(User, 'findOne').mockImplementation((criterias) => {
      return {
        id: 1212,
        name: 'John'
      };
    });
  });

  afterAll(() => {
    userSpy.mockRestore();
  });
  
  test('GET /api/v1/users/me with no token should return 401', async () => {
    const response = await request(app).get('/api/v1/users/me');
    expect(response.statusCode).toBe(401);
  });

  test('GET /api/v1/users/me?token=<invalid> should return 403', async () => {
    const response = await request(app).get('/api/v1/users/me?token=123456');
    expect(response.statusCode).toBe(403);
  });

  // create a valid token
  var payload = {
    id: 1212,
    name: 'John',
    admin: true
  }
  var options = {
    expiresIn: 86400 // expires in 24 hours
  }
  var token = jwt.sign(payload, config.superSecret, options);
      
  test('GET /api/v1/users/me?token=<valid> should return 200', async () => {
    const response = await request(app).get('/api/v1/users/me?token='+token);
    expect(response.statusCode).toBe(200);
  });

  test('GET /api/v1/users/me?token=<valid> should return user information', async () => {
    const response = await request(app).get('/api/v1/users/me?token='+token);
    const user = response.body;
    expect(user).toBeDefined();
    expect(user.id).toBe(1212);
    expect(user.name).toBe('John');
  });
});
