import request from 'supertest';
import jwt from 'jsonwebtoken';
import app from './app.js';
import { connectTestDatabase, disconnectTestDatabase } from '../test/database.js';

const token = jwt.sign({ id: '507f1f77bcf86cd799439011', role: 'user' }, process.env.SUPER_SECRET);

describe('Notifications API', () => {
  beforeAll(async () => {
    await connectTestDatabase();
  });

  afterAll(async () => {
    await disconnectTestDatabase();
  });
  test('requires authentication', async () => {
    await request(app).get('/api/v1/notifications').expect(401);
  });

  test('rejects an invalid authenticated student identifier', async () => {
    const invalidToken = jwt.sign({ id: 'invalid', role: 'user' }, process.env.SUPER_SECRET);
    await request(app).get('/api/v1/notifications').set('x-access-token', invalidToken).expect(400);
  });

  test('accepts an authenticated user token', async () => {
    const response = await request(app).get('/api/v1/notifications').set('x-access-token', token).expect(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});
