const express = require('express');
const router = express.Router();
const Student = require('./models/student'); // get our mongoose model
const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
const {OAuth2Client} = require('google-auth-library');

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
/**
 * https://developers.google.com/identity/gsi/web/guides/verify-google-id-token?hl=it#node.js
*/
const client = new OAuth2Client( GOOGLE_CLIENT_ID );
async function verify( token ) {
	const ticket = await client.verifyIdToken({
		idToken: token,
		// audience: GOOGLE_CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
		// Or, if multiple clients access the backend:
		//[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
	});
	const payload = ticket.getPayload();
	const userid = payload['sub'];
	// If the request specified a Google Workspace domain:
	// const domain = payload['hd'];
	return payload;
}

// ---------------------------------------------------------
// route to authenticate and get a new token
// ---------------------------------------------------------
router.post('', async function(req, res) {

	var user = {};

	if ( req.body.googleToken ) {
		const payload = await verify( req.body.googleToken ).catch(console.error);
		console.log(payload);

		user = await Student.findOne({ email: payload['email'] }).exec();
		if ( ! user ) {
			user = new Student({
				email: payload['email'],
				password: 'default-google-password-to-be-changed'
			});
			await user.save().exec();
			console.log('Student created after login with google');
			
		}
		
	}
	else {
		// find the user in the local db
		user = await Student.findOne({
			email: req.body.email
		}).exec();
	
		// local user not found
		if (!user) {
			res.json({ success: false, message: 'Authentication failed. User not found.' });
			return;
		}
	
		// check if password matches
		if (user.password != req.body.password) {
			res.json({ success: false, message: 'Authentication failed. Wrong password.' });
			return;
		}
	}
	
	// if user is found or created create a token
	var payload = {
		email: user.email,
		id: user._id
		// other data encrypted in the token	
	}
	var options = {
		expiresIn: 86400 // expires in 24 hours
	}
	var token = jwt.sign(payload, process.env.SUPER_SECRET, options);

	res.json({
		success: true,
		message: 'Enjoy your token!',
		token: token,
		email: user.email,
		id: user._id,
		self: "api/v1/" + user._id
	});

});



module.exports = router;