import express from 'express';
import mongoose from 'mongoose';
import Booklending from './models/booklending.js';
import Student from './models/student.js';
import Book from './models/book.js';
import Notification from './models/notification.js';
import { canAccessStudent, isOperator, requireOperator } from './authorization.js';

const router = express.Router();
const LOAN_DAYS = 30;

function extractId(value) {
    if (typeof value !== 'string') return undefined;
    return value.substring(value.lastIndexOf('/') + 1);
}

function validId(value) {
    return typeof value === 'string' && mongoose.Types.ObjectId.isValid(value);
}

function representation(entry) {
    return {
        self: '/api/v1/booklendings/' + entry._id,
        student: { self: '/api/v1/students/' + entry.student?._id, email: entry.student?.email },
        book: { self: '/api/v1/books/' + entry.book?._id, title: entry.book?.title },
        start_date: entry.start_date,
        end_date: entry.end_date,
        status: entry.status,
        returnedAt: entry.returnedAt
    };
}

router.get('', async (req, res) => {
    const requestedStudentId = req.query.studentId;
    const studentId = requestedStudentId || (!isOperator(req) ? req.loggedUser?.id : undefined);
    if (studentId && !validId(studentId)) return res.status(400).json({ error: 'Invalid student ID' });
    if (studentId && !canAccessStudent(req, studentId)) {
        return res.status(403).json({ error: 'You can only access your own booklendings' });
    }

    const filter = studentId ? { student: studentId } : {};
    const booklendings = await Booklending.find(filter)
        .populate('student', '-password -__v')
        .populate('book', '-__v')
        .exec();
    res.status(200).json(booklendings.map(representation));
});

router.post('', async (req, res) => {
    const body = req.body || {};
    const studentId = extractId(body.student);
    const bookId = extractId(body.book);

    if (!body.student) return res.status(400).json({ error: 'Student not specified' });
    if (!body.book) return res.status(400).json({ error: 'Book not specified' });
    if (!validId(studentId) || !validId(bookId)) return res.status(400).json({ error: 'Student or book ID is invalid' });
    if (!canAccessStudent(req, studentId)) return res.status(403).json({ error: 'You can only create your own booklendings' });

    const [student, book] = await Promise.all([Student.findById(studentId), Book.findById(bookId).exec()]);
    if (!student) return res.status(400).json({ error: 'Student does not exist' });
    if (!book) return res.status(400).json({ error: 'Book does not exist' });
    if (await Booklending.findOne({ book: bookId, status: 'active' }).exec()) {
        return res.status(409).json({ error: 'Book already out' });
    }

    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + LOAN_DAYS);
    const lending = await new Booklending({
        student: studentId, book: bookId, start_date: startDate, end_date: endDate, status: 'active'
    }).save();
    await Notification.create({
        student: studentId, type: 'loan_created',
        message: `Prestito creato. Scadenza: ${endDate.toISOString()}`
    });
    res.location('/api/v1/booklendings/' + lending.id).status(201).send();
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    if (!validId(id)) return res.status(400).json({ error: 'Invalid lending ID' });
    const lending = await Booklending.findById(id).exec();
    if (!lending) return res.status(404).send();
    if (!canAccessStudent(req, lending.student)) return res.status(403).json({ error: 'You can only return your own booklendings' });
    if (lending.status === 'returned') return res.status(409).json({ error: 'Booklending already returned' });

    lending.status = 'returned';
    lending.returnedAt = new Date();
    await lending.save();
    await Notification.create({ student: lending.student, type: 'loan_returned', message: 'Libro restituito correttamente.' });
    res.status(204).send();
});

router.patch('/:id/extension', requireOperator, async (req, res) => {
    const { id } = req.params;
    if (!validId(id)) return res.status(400).json({ error: 'Invalid lending ID' });
    const lending = await Booklending.findById(id).exec();
    if (!lending) return res.status(404).send();
    if (lending.status !== 'active') return res.status(409).json({ error: 'Only active booklendings can be extended' });

    const endDate = new Date(lending.end_date || Date.now());
    endDate.setDate(endDate.getDate() + LOAN_DAYS);
    lending.end_date = endDate;
    await lending.save();
    await Notification.create({ student: lending.student, type: 'loan_extended', message: `Prestito prorogato. Nuova scadenza: ${endDate.toISOString()}` });
    res.status(200).json({ self: '/api/v1/booklendings/' + lending.id, end_date: lending.end_date });
});

export default router;
