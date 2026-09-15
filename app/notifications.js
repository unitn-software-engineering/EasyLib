import express from 'express';
import mongoose from 'mongoose';
import Notification from './models/notification.js';
import { isOperator } from './authorization.js';

const router = express.Router();

router.get('', async (req, res) => {
    const studentId = isOperator(req) && req.query.studentId ? req.query.studentId : req.loggedUser?.id;
    if (!studentId || !mongoose.Types.ObjectId.isValid(studentId)) {
        return res.status(400).json({ error: 'Valid student ID required' });
    }
    const notifications = await Notification.find({ student: studentId }).sort({ createdAt: -1 }).exec();
    res.status(200).json(notifications);
});

router.patch('/:id/read', async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).json({ error: 'Invalid notification ID' });
    const notification = await Notification.findById(req.params.id).exec();
    if (!notification) return res.status(404).send();
    if (!isOperator(req) && String(notification.student) !== String(req.loggedUser?.id)) {
        return res.status(403).json({ error: 'You can only update your own notifications' });
    }
    notification.read = true;
    await notification.save();
    res.status(204).send();
});

export default router;
