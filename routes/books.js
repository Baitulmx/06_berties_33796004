// Create a new router
const express = require("express")
const router = express.Router()

const redirectLogin = (req, res, next) => {
    if (!req.session.userId) {
        // send them to the users login page
        res.redirect('../users/login');
    } else {
        next();
    }
};

router.get('/search', function(req, res, next){
    res.render("search.ejs")
});

router.post('/search-result', function(req, res, next) {
    let keyword = "%" + req.body.keyword + "%";
    let sqlquery = "SELECT * FROM books WHERE name LIKE ?";

    db.query(sqlquery, [keyword], (err, result) => {
        if (err) next(err);
        else res.render("list.ejs", { availableBooks: result });
    });
});

router.get('/list', redirectLogin, function(req, res, next) {
    let sqlquery = "SELECT * FROM books"; // query from database

    db.query(sqlquery, (err, result) => {
        if (err) {
            next(err);
        } else {
            res.render("list.ejs", { availableBooks: result });
        }
    });
});

router.get('/addbook', redirectLogin, function(req, res, next) {
    res.render("addbook.ejs");
});

router.post('/bookadded', redirectLogin, function(req, res, next) {
    let sqlquery = "INSERT INTO books (name, price) VALUES (?,?)";

    let newrecord = [req.body.name, req.body.price];

    db.query(sqlquery, newrecord, (err, result) => {
        if (err) {
            next(err);
        } else {
            res.send('This book was added: ' + req.body.name + ' (£' + req.body.price + ')');
        }
    });
});

router.get('/bargainbooks', redirectLogin, function(req, res, next) {
    let sqlquery = "SELECT * FROM books WHERE price < 20";

    db.query(sqlquery, (err, result) => {
        if (err) next(err);
        else res.render("list.ejs", { availableBooks: result });
    });
});

// Export the router object so index.js can access it
module.exports = router
