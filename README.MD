## 🌱 dotenv (Brief Implementation)

I used the dotenv module to keep my database credentials secure.  
Instead of writing the MySQL username, password, and database name directly in `index.js`, I stored them in a `.env` file (which is ignored by GitHub).

Steps implemented:
- Installed dotenv (`npm install dotenv`)
- Created a `.env` file with:
  BB_USER='berties_books_app'
  BB_PASSWORD='qwertyuiop'
  BB_DATABASE='berties_books'
- Loaded dotenv at the top of `index.js`  
  require('dotenv').config();
- Updated the MySQL connection to use `process.env` variables.

This keeps credentials private and follows the lab requirements.

---

## 📜 Audit Logging (Brief Implementation)

I implemented an audit logging system to record every login attempt (successful or failed).

Steps implemented:
- Created an `audit_log` table with fields:
  username, success (true/false), timestamp
- Modified the `/users/loggedin` route to insert a log entry after each login attempt:
  - success = true → correct password  
  - success = false → wrong password or username not found
- Created a `/users/audit` page to display all audit log entries.

## Lab 8 – Authorisation, Validation, and Sanitisation

### 1. Authorisation (Lab 8a)

In this lab I implemented session-based authorisation using express-session.  
When a user successfully logs in, their username is stored inside the session so they can be identified across multiple requests.

A redirectLogin middleware was created to protect restricted pages.  
It checks whether a valid session exists and, if not, redirects the user to the login page.  
This middleware was applied to routes such as viewing users, adding books, viewing bargain books, and accessing the audit log.  
A logout route was also added to destroy the session and clear the session cookie.

---

### 2. Input Validation (Lab 8bc)

I implemented server-side validation with express-validator to ensure all registration inputs meet required rules before being processed.  
The registration form checks that the email is valid, the username is an appropriate length, and the password is long enough.  
If validation fails, the registration page is re-rendered with error messages so the user can correct their input.

---

### 3. Input Sanitisation (Lab 8bc)

To protect against XSS and unsafe input, two layers of sanitisation were added:

• express-validator sanitisation removes unwanted characters, extra whitespace, and HTML tags before validation.  
• express-sanitizer was then used to clean all req.body fields before inserting them into the database or storing them in the session.

All user-provided fields were sanitised, including first name, last name, username, email, password, book names, book prices, search keywords, and login fields.

---

### 4. Handling Sanitisation Issues (Lab 8bc Task 7)

If sanitisation removes unsafe characters and leaves a field empty or invalid, the application safely stops processing the request and informs the user.  
This prevents partially-sanitised or unsafe data from being stored in the database.

---

### 5. Summary

This lab introduced full security around user login sessions, protected routes, server-side validation, and two-layer sanitisation.  
All user input is now validated and cleaned before use, improving safety and preventing common attacks such as XSS or malicious form submissions.

## Weather API (Lab 9a)

In this part of the lab I added a new route (`/weather`) that calls the OpenWeatherMap API.  
The route sends a request to the API, receives JSON weather data, and displays it to the user.

I also added a form so the user can type a city name.  
When the form is submitted, the server fetches weather information for that specific city and displays details such as:
- temperature  
- feels-like temperature  
- min/max temperature  
- humidity  
- wind speed  
- general weather description  

The results page was formatted to present the information more clearly.

---

## Books API (Lab 9b)

This lab introduced an `/api/books` route that returns book data in JSON format.  
The API supports several optional parameters:

### 1. Search term  
`/api/books?search=word`  
Returns only the books whose names contain the search term.

### 2. Price range  
`/api/books?minprice=5&max_price=10`  
Returns only books between the selected price limits.

### 3. Sort option  
`/api/books?sort=name`  
`/api/books?sort=price`  
Sorts the returned books either alphabetically or by price.

If no parameters are added, the API returns all books.
