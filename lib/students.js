const express = require('express');
const router = express.Router();
const db = require('./db.js');



router.get('', (req, res) => {
    let students = db.students.all()
    .filter( (entry) => {
        if( req.query.email )
            return entry.email == req.query.email;
        return true;
    }).map( (entry) => {
        return {
            self: '/api/v1/students/' + entry.id,
            email: entry.email
        }
    });
    res.status(200).json(students);
});

router.post('', (req, res) => {
    let student = {
        email: req.body.email
    };
    
    if (!student.email || typeof student.email != 'string' || !checkIfEmailInString(student.email)) {
        res.status(400).json({ error: 'The field "email" must be a non-empty string, in email format' });
        return;
    }

    let studentId = db.students.insert(student);

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
