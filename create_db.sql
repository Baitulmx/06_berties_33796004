# Create database script for Berties Books

# Create the database
CREATE DATABASE IF NOT EXISTS berties_books;
USE berties_books;

# Create the books table
CREATE TABLE IF NOT EXISTS books (
    id INT AUTO_INCREMENT,
    name VARCHAR(50),
    price DECIMAL(5,2),
    PRIMARY KEY(id)
);

# Create the users table 
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50),
    first VARCHAR(50),
    last VARCHAR(50),
    email VARCHAR(100),
    hashedPassword VARCHAR(255)
);

# Create the audit log table
CREATE TABLE IF NOT EXISTS audit_log (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50),
    success BOOLEAN,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);

# Create the application user for VM MySQL
CREATE USER IF NOT EXISTS 'berties_books_app'@'localhost' IDENTIFIED BY 'qwertyuiop';
GRANT ALL PRIVILEGES ON berties_books.* TO 'berties_books_app'@'localhost';
