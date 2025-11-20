# Bertie’s Books  
Dynamic Web Applications

---

## 🔐 Password Hashing

User passwords are hashed using bcrypt before being stored in the database.

Example hashing code:

const bcrypt = require('bcrypt');
const saltRounds = 10;
const plainPassword = req.body.password;

bcrypt.hash(plainPassword, saltRounds, function(err, hashedPassword) {
    // store hashedPassword in database
});

Users table:

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50),
    first VARCHAR(50),
    last VARCHAR(50),
    email VARCHAR(100),
    hashedPassword VARCHAR(255)
);

---

## 🔐 Login System

Login compares the submitted password with the stored hashed password using bcrypt:

bcrypt.compare(req.body.password, hashedPassword, function(err, result) {
    if (err) {
        // error
    }
    else if (result === true) {
        // login success
    }
    else {
        // login fail
    }
});

---

## 🌱 dotenv

Database credentials were moved out of index.js and secured using dotenv.

.env file (not committed to GitHub):

BB_USER='berties_books_app'
BB_PASSWORD='qwertyuiop'
BB_DATABASE='berties_books'

Updated database connection:

require('dotenv').config();

const db = mysql.createPool({
    host: 'localhost',
    user: process.env.BB_USER,
    password: process.env.BB_PASSWORD,
    database: process.env.BB_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

---

## 📜 Audit Logging

Every login attempt (success or failure) is saved in an audit table.

Audit table:

CREATE TABLE IF NOT EXISTS audit_log (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50),
    success BOOLEAN,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);

Logging each attempt:

INSERT INTO audit_log (username, success) VALUES (?, ?);

Audit log viewer route:

/users/audit

---

## ✔ Completed Tasks

- Password hashing with bcrypt  
- Registration storing hashed passwords  
- Login using bcrypt.compare()  
- dotenv-secured DB credentials  
- Full audit logging system  
- /users/list page excluding passwords  
