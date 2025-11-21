// Create a new router
const express = require("express")
const router = express.Router()
const bcrypt = require('bcrypt');

router.get('/register', function (req, res, next) {
    res.render('register.ejs')
})

router.post('/registered', function (req, res, next) {

    const saltRounds = 10;
    const plainPassword = req.body.password;

    // Hash the password
    bcrypt.hash(plainPassword, saltRounds, function(err, hashedPassword) {
        if (err) {
            return next(err);
        }

        // Insert into database
        let sqlquery = "INSERT INTO users (username, first, last, email, hashedPassword) VALUES (?,?,?,?,?)";

        let newUser = [
            req.body.username,
            req.body.first,
            req.body.last,
            req.body.email,
            hashedPassword
        ];

        db.query(sqlquery, newUser, (err, result) => {
            if (err) {
                next(err);
            } else {

                // Task 2 Step 6
                let message = 'Hello '+ req.body.first + ' '+ req.body.last 
                              + ', you are now registered! We will send an email to ' + req.body.email + '<br><br>';

                message += 'Your password is: '+ req.body.password + '<br>';
                message += 'Your hashed password is: '+ hashedPassword;

                res.send(message);
            }
        });
    });
});

router.get('/list', function(req, res, next) {

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

    const username = req.body.username;
    const plainPassword = req.body.password;

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

router.get('/audit', function(req, res, next) {

    let sqlquery = "SELECT * FROM audit_log ORDER BY timestamp DESC";

    db.query(sqlquery, (err, result) => {
        if (err) return next(err);

        res.render("audit.ejs", { logs: result });
    });
});

// Export the router object so index.js can access it
module.exports = router
