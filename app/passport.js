const passport = require('passport');
const GoogleStrategy = require('passport-google-oidc');
const session = require('express-session')
const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens

passport.serializeUser((user, done) => {
    done(null, user.email);
 });
 
 passport.deserializeUser(async (email, done) => {
    let USER = await Student.findOne({
		email: email
	}).exec();
	done(null, USER);
 });

passport.use(new GoogleStrategy(
    {
        clientID: process.env['GOOGLE_CLIENT_ID'],
        clientSecret: process.env['GOOGLE_CLIENT_SECRET'],
        callbackURL: process.env['GOOGLE_REDIRECT']//'http://localhost:8080/oauth2/redirect/google'
    },
    function(issuer, profile, cb) {
        
        // create a token
        var payload = {
            email: profile.email,
            id: profile.email
            // other data encrypted in the token	
        }
        var options = {
            expiresIn: 86400 // expires in 24 hours
        }
        var token = jwt.sign(payload, process.env.SUPER_SECRET, options);

        return cb(null/*error*/, {email: profile.email}/*user*/);
    }
));


module.exports = passport;