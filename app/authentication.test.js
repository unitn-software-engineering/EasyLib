import { jest } from '@jest/globals';
import request from 'supertest';
import app from './app.js';
import Student from './models/student.js';
import { hashPassword } from './security/password.js';

describe('Authentication API', () => {
  test('authenticates an operator created with the CLI', async () => {
    const findOne = jest.spyOn(Student, 'findOne').mockReturnValue({
      exec: () => Promise.resolve({
        _id: '507f1f77bcf86cd799439011',
        email: 'operator@example.com',
        password: hashPassword('operator-password'),
        role: 'operator'
      })
    });

    const response = await request(app)
      .post('/api/v1/authentications')
      .send({ email: ' Operator@Example.com ', password: 'operator-password' })
      .expect(200);

    expect(response.body.role).toBe('operator');
    expect(response.body.token).toBeDefined();
    findOne.mockRestore();
  });

  test('returns the backend error for an unknown operator', async () => {
    const findOne = jest.spyOn(Student, 'findOne').mockReturnValue({ exec: () => Promise.resolve(null) });
    await request(app)
      .post('/api/v1/authentications')
      .send({ email: 'missing@example.com', password: 'operator-password' })
      .expect(401, { success: false, message: 'Authentication failed. User not found.' });
    findOne.mockRestore();
  });
});
