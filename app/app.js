const express = require('express');
const app = express();
const cors = require('cors')

const authentication = require('./authentication.js');
const tokenChecker = require('./tokenChecker.js');

const students = require('./students.js');
const books = require('./books.js');
const booklendings = require('./booklendings.js');


/**
 * Configure Express.js parsing middleware
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



/**
 * CORS requests
 */
app.use(cors())

// // Add headers before the routes are defined
// app.use(function (req, res, next) {

//     // Website you wish to allow to connect
//     res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

//     // Request methods you wish to allow
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

//     // Request headers you wish to allow
//     res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

//     // Set to true if you need the website to include cookies in the requests sent
//     // to the API (e.g. in case you use sessions)
//     res.setHeader('Access-Control-Allow-Credentials', true);

//     // Pass to next layer of middleware
//     next();
// });



app.use((req,res,next) => {
    console.log(req.method + ' ' + req.url)
    next()
})



/**
 * Authentication routing and middleware
 */
app.use('/api/v1/authentications', authentication);

// Protect booklendings endpoint
// access is restricted only to authenticated users
// a valid token must be provided in the request
app.use('/api/v1/booklendings', tokenChecker);
app.use('/api/v1/students/me', tokenChecker);



/**
 * Resource routing
 */

app.use('/api/v1/books', books);
app.use('/api/v1/students', students);
app.use('/api/v1/booklendings', booklendings);



/**
 * Supporting session for front-end
 */
const session = require('express-session')
const cookieParser = require('cookie-parser')

app.use(session({
    secret: process.env['SUPER_SECRET'],
    resave: false,
    saveUninitialized: false,
}))
app.use((req,res,next) => {
    console.log(req.session)
    next()
})
app.use(cookieParser());



/**
 * Serve front-end static files
 */
app.use('/', express.static(process.env.FRONTEND || 'static'));
// If process.env.FRONTEND folder does not contain index.html then use the one from static
app.use('/', express.static('static')); // expose also this folder

app.use('/loggedUser.js', (req, res) => res.send({token: req.session.token, user: req.session.user}) );



/**
 * Passport
 * https://www.passportjs.org/concepts/authentication/google/
 * https://medium.com/@prashantramnyc/how-to-implement-google-authentication-in-node-js-using-passport-js-9873f244b55e
 */
const passport = require('passport');
const GoogleStrategy = require('passport-google-oidc');
const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens

app.use(passport.authenticate('session'));
app.use(passport.initialize())
app.use(passport.session())

passport.use(new GoogleStrategy( {
        clientID: process.env['GOOGLE_CLIENT_ID'],
        clientSecret: process.env['GOOGLE_CLIENT_SECRET'],
        callbackURL: process.env['GOOGLE_REDIRECT'],//'http://localhost:8080/oauth2/redirect/google'
        // passReqToCallback: true
    }, (issuer, profile, cb) => cb(null, profile) )
);
passport.serializeUser((user, done) => {
    console.log(`\n--------> Serialize User:`)
    console.log(user)
    // The USER object is the "authenticated user" from the done() in authUser function.
    // serializeUser() will attach this user to "req.session.passport.user.{user}", so that it is tied to the session object for each session.  
    done(null, user);
});
passport.deserializeUser(async (email, done) => {
    // let user = await Student.findOne({
    //     email: email
    // }).exec();
    console.log("\n--------- Deserialized User", email)
    console.log(user)
    // This is the {user} that was saved in req.session.passport.user.{user} in the serializationUser()
    // deserializeUser will attach this {user} to the "req.user.{user}", so that it can be used anywhere in the App.
    done (null, user)
});

app.get('/login/google',
    passport.authenticate('google', { scope: [ 'email', 'profile' ] })
);

app.get('/oauth2/redirect/google',
    passport.authenticate('google', { failureRedirect: '/login', failureMessage: true }),
    function(req, res) {
        // create a token
        var payload = {
            email: req.session.passport.user.emails[0],
            id: req.session.passport.user.id
            // other data encrypted in the token	
        }
        var options = {
            expiresIn: 86400 // expires in 24 hours
        }
        var token = jwt.sign(payload, process.env.SUPER_SECRET, options);
        req.session.token = token
        req.session.user = req.session.passport.user

        res.cookie('token', token, { maxAge: 900000, httpOnly: false });
        res.redirect('/');
    }
);



/* Default 404 handler */
app.use((req, res) => {
    res.status(404);
    res.json({ error: 'Not found' });
});



module.exports = app;
