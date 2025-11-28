// Create a new router
const express = require("express")
const router = express.Router()
const bcrypt = require('bcrypt');
const { check, validationResult } = require('express-validator');

const redirectLogin = (req, res, next) => {
    if (!req.session.userId ) {
      res.redirect('../users/login') // redirect to the login page
    } else { 
        next (); // move to the next middleware function
    } 
};

router.get('/register', function (req, res, next) {
    res.render('register.ejs')
})

router.post('/registered',
[   
    //Authenicate and Validate
    check('email').isEmail().withMessage('Enter a valid email'),
    check('username').isLength({ min: 5, max: 20 }).withMessage('Username must be 5–20 chars'),
    check('password').isLength({ min: 8 }).withMessage('Password must be at least 8 chars'),
    check('first').notEmpty().withMessage('First name is required').isAlpha(),
    check('last').notEmpty().withMessage('Last name is required').isAlpha(),

    //Sanitize
    check('email').normalizeEmail(),
    check('username').trim().escape(),
    check('first').trim().escape(),
    check('last').trim().escape(),
    check('password').trim().escape()
],
function (req, res, next) {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.render('register.ejs', { errors: errors.array() });
    }

    const saltRounds = 10;
    const plainPassword = req.body.password;

    bcrypt.hash(plainPassword, saltRounds, function(err, hashedPassword) {
        if (err) {
            return next(err);
        }

        let sqlquery = "INSERT INTO users (username, first, last, email, hashedPassword) VALUES (?,?,?,?,?)";

        let newUser = [
            req.sanitize(req.body.username),
            req.sanitize(req.body.first),
            req.sanitize(req.body.last),
            req.sanitize(req.body.email),
            hashedPassword
        ];

        db.query(sqlquery, newUser, (err, result) => {
            if (err) {
                return next(err);
            } else {
                let message = 'Hello '+ req.sanitize(req.body.first) + ' '+ req.sanitize(req.body.last) 
                              + ', you are now registered! We will send an email to ' + req.sanitize(req.body.email) + '<br><br>';

                message += 'Your password is: '+ (req.sanitize(req.body.password)) + '<br>';
                message += 'Your hashed password is: '+ hashedPassword;

                return res.send(message);
            }
        });
    });
});


router.get('/list', redirectLogin, function(req, res, next) {

    let sqlquery = "SELECT username, first, last, email FROM users";

    db.query(sqlquery, (err, result) => {
        if (err) {
            next(err);
        } else {
            res.render("listusers.ejs", { users: result });
        }
    });

});

router.get('/login', function(req, res, next) {
    res.render('login.ejs');
});

router.post('/loggedin', function(req, res, next) {

    const username = req.sanitize(req.body.username);
    const plainPassword = req.sanitize(req.body.password);

    // Step 1: Fetch user from DB
    let sqlquery = "SELECT * FROM users WHERE username = ?";

    db.query(sqlquery, [username], (err, results) => {
        if (err) return next(err);

        // Username not found
        if (results.length === 0) {

            // LOG failed login
            let auditFail = "INSERT INTO audit_log (username, success) VALUES (?, ?)";
            db.query(auditFail, [username, false]);

            return res.send("Login failed: Username not found.");
        }

        const hashedPassword = results[0].hashedPassword;

        // Step 2: Compare passwords
        bcrypt.compare(plainPassword, hashedPassword, function(err, result) {

            if (err) return next(err);

            if (result === true) {

                // Set session userId
                req.session.userId = req.sanitize(req.body.username);
                // LOG successful login
                let auditSuccess = "INSERT INTO audit_log (username, success) VALUES (?, ?)";
                db.query(auditSuccess, [username, true]);

                res.send("Login successful! Welcome " + username);

            } else {

                // LOG failed login
                let auditFail = "INSERT INTO audit_log (username, success) VALUES (?, ?)";
                db.query(auditFail, [username, false]);

                res.send("Login failed: Incorrect password.");
            }

        });
    });
});

router.get('/audit', redirectLogin, function(req, res, next) {

    let sqlquery = "SELECT * FROM audit_log ORDER BY timestamp DESC";

    db.query(sqlquery, (err, result) => {
        if (err) return next(err);

        res.render("audit.ejs", { logs: result });
    });
});

// Export the router object so index.js can access it
module.exports = router
