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

This meets the lab requirement to track user login activity.
