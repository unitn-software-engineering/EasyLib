import { jest } from '@jest/globals';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import app from './app.js';
import Booklending from './models/booklending.js';
import Notification from './models/notification.js';

const studentId = '507f1f77bcf86cd799439011';
const lendingId = '507f1f77bcf86cd799439012';
const userToken = jwt.sign({ email: 'user@easylib.test', id: studentId, role: 'user' }, process.env.SUPER_SECRET);

describe('Booklending API', () => {
  beforeAll(() => {
    jest.spyOn(Notification, 'create').mockResolvedValue({});
  });

  afterAll(() => {
    Notification.create.mockRestore();
  });
  test('POST without a student returns 400', async () => {
    await request(app).post('/api/v1/booklendings').set('x-access-token', userToken).send({})
      .expect(400, { error: 'Student not specified' });
  });

  test('POST without a book returns 400', async () => {
    await request(app).post('/api/v1/booklendings').set('x-access-token', userToken)
      .send({ student: `/api/v1/students/${studentId}` })
      .expect(400, { error: 'Book not specified' });
  });

  test('POST with malformed identifiers returns 400', async () => {
    await request(app).post('/api/v1/booklendings').set('x-access-token', userToken)
      .send({ student: '/api/v1/students/invalid', book: '/api/v1/books/invalid' })
      .expect(400, { error: 'Student or book ID is invalid' });
  });

  test('DELETE without a token returns 401', async () => {
    await request(app).delete(`/api/v1/booklendings/${lendingId}`).expect(401);
  });

  test('DELETE with a malformed identifier returns 400', async () => {
    await request(app).delete('/api/v1/booklendings/invalid').set('x-access-token', userToken)
      .expect(400, { error: 'Invalid lending ID' });
  });

  test('DELETE preserves the lending as returned', async () => {
    const lending = {
      _id: lendingId,
      student: new mongoose.Types.ObjectId(studentId),
      status: 'active',
      save: jest.fn().mockResolvedValue(undefined)
    };
    const findById = jest.spyOn(Booklending, 'findById')
      .mockReturnValue({ exec: () => Promise.resolve(lending) });

    await request(app).delete(`/api/v1/booklendings/${lendingId}`).set('x-access-token', userToken)
      .expect(204);

    expect(lending.status).toBe('returned');
    expect(lending.returnedAt).toBeInstanceOf(Date);
    expect(lending.save).toHaveBeenCalled();
    findById.mockRestore();
  });
});
