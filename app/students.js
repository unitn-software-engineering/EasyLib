const express = require('express');
const router = express.Router();
const Student = require('./models/student'); // get our mongoose model



router.get('/me', async (req, res) => {
    if(!req.loggedUser) {
        return;
    }

    // https://mongoosejs.com/docs/api.html#model_Model.find
    let student = await Student.findOne({email: req.loggedUser.email});

    res.status(200).json({
        self: '/api/v1/students/' + student.id,
        email: student.email
    });
});

router.get('', async (req, res) => {
    let students;

    if (req.query.email)
        // https://mongoosejs.com/docs/api.html#model_Model.find
        students = await Student.find({email: req.query.email}).exec();
    else
        students = await Student.find().exec();

    students = students.map( (entry) => {
        return {
            self: '/api/v1/students/' + entry.id,
            email: entry.email
        }
    });

    res.status(200).json(students);
});

router.post('', async (req, res) => {
    
	let student = new Student({
        email: req.body.email,
        password: req.body.password
    });

    if (!student.email || typeof student.email != 'string' || !checkIfEmailInString(student.email)) {
        res.status(400).json({ error: 'The field "email" must be a non-empty string, in email format' });
        return;
    }
    
	student = await student.save();
    
    let studentId = student.id;

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



module.exports = router;
