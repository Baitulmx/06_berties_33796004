const express = require('express');
const router = express.Router();

// --------------------------------------------------
// Task 1: Basic API Route - Return ALL books
// Task 2: Same route but with JSON formatting
// Tasks 3–5: Search, Price Range, Sort
// --------------------------------------------------

router.get('/books', function (req, res, next) {

    // Get optional query parameters
    let search = req.query.search;
    let minprice = req.query.minprice;
    let maxprice = req.query.max_price;
    let sort = req.query.sort;

    // Base query
    let sqlquery = "SELECT * FROM books";
    let params = [];
    let conditions = [];

    // ---------------------------------------------
    // Task 4: Price range
    // ---------------------------------------------
    if (minprice && maxprice) {
        conditions.push("price BETWEEN ? AND ?");
        params.push(minprice, maxprice);
    }

    // ---------------------------------------------
    // Task 3: Search term
    // ---------------------------------------------
    if (search) {
        conditions.push("name LIKE ?");
        params.push('%' + search + '%');
    }

    // Add WHERE clause if any conditions exist
    if (conditions.length > 0) {
        sqlquery += " WHERE " + conditions.join(" AND ");
    }

    // ---------------------------------------------
    // Task 5: Sorting (name or price)
    // ---------------------------------------------
    if (sort === "name") {
        sqlquery += " ORDER BY name ASC";
    } else if (sort === "price") {
        sqlquery += " ORDER BY price ASC";
    }

    // Execute query
    db.query(sqlquery, params, (err, result) => {
        if (err) {
            next(err);
        } else {
            res.json(result);   // return JSON to the browser
        }
    });
});

module.exports = router;
