import { jest } from '@jest/globals';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import app from './app.js';
import Student from './models/student.js';
import Booklending from './models/booklending.js';
import Notification from './models/notification.js';

const studentId = '507f1f77bcf86cd799439011';
const operatorToken = jwt.sign({ id: '507f1f77bcf86cd799439099', role: 'operator' }, process.env.SUPER_SECRET);

describe('Student deletion API', () => {
  test('requires an operator token', async () => {
    await request(app).delete(`/api/v1/students/${studentId}`).expect(401);
  });

  test('deletes the student and related records', async () => {
    const findById = jest.spyOn(Student, 'findById').mockReturnValue({ exec: () => Promise.resolve({ _id: studentId }) });
    const deleteLendings = jest.spyOn(Booklending, 'deleteMany').mockReturnValue({ exec: () => Promise.resolve({ deletedCount: 2 }) });
    const deleteNotifications = jest.spyOn(Notification, 'deleteMany').mockReturnValue({ exec: () => Promise.resolve({ deletedCount: 2 }) });
    const deleteStudent = jest.spyOn(Student, 'deleteOne').mockReturnValue({ exec: () => Promise.resolve({ deletedCount: 1 }) });

    await request(app).delete(`/api/v1/students/${studentId}`).set('x-access-token', operatorToken).expect(204);

    expect(deleteLendings).toHaveBeenCalledWith({ student: studentId });
    expect(deleteNotifications).toHaveBeenCalledWith({ student: studentId });
    expect(deleteStudent).toHaveBeenCalledWith({ _id: studentId });
    findById.mockRestore();
    deleteLendings.mockRestore();
    deleteNotifications.mockRestore();
    deleteStudent.mockRestore();
  });
});
