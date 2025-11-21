# Insert data into the tables

USE berties_books;

INSERT INTO books (name, price)
VALUES 
('Brighton Rock', 20.25),
('Brave New World', 25.00),
('Animal Farm', 12.99);

INSERT INTO users (username, first, last, email, hashedPassword)
VALUES 
('gold', 'Gold', 'Smiths', 'gold@example.com', '$2b$10$FO/0EvtT9jXqxDvkBklNPe4LckM3eshALA7hoAsenLN4wGs0as0I6');
