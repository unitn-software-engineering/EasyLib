import express from 'express';
import Student from './models/student.js'; // get our mongoose model
import mongoose from 'mongoose';
import Booklending from './models/booklending.js';
import Notification from './models/notification.js';
import { hashPassword } from './security/password.js';
import tokenChecker from './tokenChecker.js';
import { requireOperator } from './authorization.js';
const router = express.Router();



router.get('/me', async (req, res) => {
    if(!req.loggedUser) {
        return;
    }

    // https://mongoosejs.com/docs/api.html#model_Model.find
    let student = await Student.findOne({email: req.loggedUser.email});

    res.status(200).json({
        self: '/api/v1/students/' + student.id,
        id: String(student.id),
        email: student.email,
        role: student.role || 'user'
    });
});

router.get('', tokenChecker, requireOperator, async (req, res) => {
    let students;

    if (req.query.email)
        // https://mongoosejs.com/docs/api.html#model_Model.find
        students = await Student.find({email: req.query.email}).exec();
    else
        students = await Student.find().exec();

    students = students.map( (entry) => {
        return {
            self: '/api/v1/students/' + entry.id,
            id: String(entry.id),
            email: entry.email,
            role: entry.role || 'user'
        }
    });

    res.status(200).json(students);
});

router.delete('/:id', tokenChecker, requireOperator, async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid student ID' });
    }

    const student = await Student.findById(id).exec();
    if (!student) return res.status(404).send();

    await Booklending.deleteMany({ student: id }).exec();
    await Notification.deleteMany({ student: id }).exec();
    await Student.deleteOne({ _id: id }).exec();
    res.status(204).send();
});

router.post('', async (req, res) => {
    
	if (!req.body.password || typeof req.body.password !== 'string' || req.body.password.length < 3) {
		res.status(400).json({ error: 'The field "password" must be a string with at least 3 characters' });
		return;
	}

	let student = new Student({
        email: req.body.email,
		password: hashPassword(req.body.password),
		firstName: req.body.firstName,
		lastName: req.body.lastName,
		fiscalCode: req.body.fiscalCode
    });

    if (!student.email || typeof student.email != 'string' || !checkIfEmailInString(student.email)) {
        res.status(400).json({ error: 'The field "email" must be a non-empty string, in email format' });
        return;
    }
    
	try {
		student = await student.save();
	} catch (error) {
		if (error?.code === 11000) {
			res.status(409).json({ error: 'A student with this email or fiscal code already exists' });
			return;
		}
		throw error;
	}
    
    let studentId = student._id;

    /**
     * Link to the newly created resource is returned in the Location header
     * https://www.restapitutorial.com/lessons/httpmethods.html
     */
    res.location("/api/v1/students/" + studentId).status(201).send();
});



// https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
function checkIfEmailInString(text) {
    // eslint-disable-next-line
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(text);
}



export default router;
