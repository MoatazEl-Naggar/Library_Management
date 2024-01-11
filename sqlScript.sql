-- Create the library_management database
CREATE DATABASE IF NOT EXISTS library_management;

-- Switch to the library_management database
USE library_management;

-- Create the books table
CREATE TABLE IF NOT EXISTS books (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    isbn VARCHAR(20) NOT NULL,
    available_quantity INT NOT NULL,
    shelf_location VARCHAR(50) NOT NULL
);

-- Create the borrowers table
CREATE TABLE IF NOT EXISTS borrowers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    registered_date DATE NOT NULL
);

-- Create the borrowings table
CREATE TABLE IF NOT EXISTS borrowings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    book_id INT NOT NULL,
    borrower_id INT NOT NULL,
    checkout_date DATE NOT NULL,
    due_date DATE NOT NULL,
    return_date DATE,
    FOREIGN KEY (book_id) REFERENCES books(id),
    FOREIGN KEY (borrower_id) REFERENCES borrowers(id)
);

-- Insert sample data (optional)
INSERT INTO books (title, author, isbn, available_quantity, shelf_location) VALUES
    ('Book 1', 'Author 1', 'ISBN001', 5, 'A1'),
    ('Book 2', 'Author 2', 'ISBN002', 3, 'B2'),
    ('Book 3', 'Author 3', 'ISBN003', 7, 'C3');

INSERT INTO borrowers (name, email, registered_date) VALUES
    ('Borrower 1', 'borrower1@example.com', '2022-01-01'),
    ('Borrower 2', 'borrower2@example.com', '2022-02-15'),
    ('Borrower 3', 'borrower3@example.com', '2022-03-20');

INSERT INTO borrowings (book_id, borrower_id, checkout_date, due_date, return_date) VALUES
    (1, 1, '2022-01-05', '2022-01-15', NULL),
    (2, 2, '2022-02-20', '2022-03-01', '2022-02-25'),
    (3, 3, '2022-03-10', '2022-03-20', NULL);
