const express = require('express');
const { db } = require('../db');

const router = express.Router();

// Add a book
router.post('/', (req, res) => {
    const { title, author, isbn, quantity, shelf_location } = req.body;

    // Check if the book with the given ISBN already exists
    const checkBookQuery = 'SELECT id, quantity FROM books WHERE isbn = ?';
    db.query(checkBookQuery, [isbn], (checkErr, checkResult) => {
        if (checkErr) {
            console.error('Error checking book:', checkErr);
            res.status(500).send('Error checking book');
            return;
        }

        if (checkResult.length > 0) {
            // Book with the given ISBN already exists, update quantity
            const existingBookId = checkResult[0].id;
            const existingQuantity = checkResult[0].quantity;

            const updateQuantityQuery = 'UPDATE books SET quantity = ? WHERE id = ?';
            const newQuantity = existingQuantity + quantity;

            db.query(updateQuantityQuery, [newQuantity, existingBookId], (updateErr, updateResult) => {
                if (updateErr) {
                    console.error('Error updating book quantity:', updateErr);
                    res.status(500).send('Error updating book quantity');
                } else {
                    res.status(200).send('Book quantity updated successfully');
                }
            });
        } else {
            // Book with the given ISBN does not exist, insert a new book
            const addBookQuery = 'INSERT INTO books (title, author, isbn, quantity, shelf_location) VALUES (?, ?, ?, ?, ?)';
            db.query(addBookQuery, [title, author, isbn, quantity, shelf_location], (addErr, addResult) => {
                if (addErr) {
                    console.error('Error adding book:', addErr);
                    res.status(500).send('Error adding book');
                } else {
                    res.status(201).send('Book added successfully');
                }
            });
        }
    });
});


// Update a book's details
router.put('/:id', (req, res) => {
    const bookId = req.params.id;
    const { title, author, isbn, quantity, shelf_location } = req.body;
    const updateBookQuery = 'UPDATE books SET title=?, author=?, isbn=?, quantity=?, shelf_location=? WHERE id=?';
    db.query(updateBookQuery, [title, author, isbn, quantity, shelf_location, bookId], (err, result) => {
        if (err) {
            console.error('Error updating book:', err);
            res.status(500).send('Error updating book');
        } else {
            res.status(200).send('Book updated successfully');
        }
    });
});

// Delete a book
router.delete('/:id', (req, res) => {
    const bookId = req.params.id;
    const deleteBookQuery = 'DELETE FROM books WHERE id=?';
    db.query(deleteBookQuery, [bookId], (err, result) => {
        if (err) {
            console.error('Error deleting book:', err);
            res.status(500).send('Error deleting book');
        } else {
            res.status(200).send('Book deleted successfully');
        }
    });
});

// List all books
router.get('/', (req, res) => {
    const listBooksQuery = 'SELECT * FROM books';
    db.query(listBooksQuery, (err, result) => {
        if (err) {
            console.error('Error listing books:', err);
            res.status(500).send('Error listing books');
        } else {
            res.status(200).json(result);
        }
    });
});

// Search for a book by title, author, or ISBN
router.get('/search', (req, res) => {
    const { title, author, isbn } = req.query;

    // Search operation performed to identify books with similar attributes in the library
    const searchBooksQuery = 'SELECT * FROM books WHERE title LIKE ? OR author LIKE ? OR isbn LIKE ?';
    const searchValue = `%${title || author || isbn}%`;
    db.query(searchBooksQuery, [searchValue, searchValue, searchValue], (err, result) => {
        if (err) {
            console.error('Error searching books:', err);
            res.status(500).send('Error searching books');
        } else {
            res.status(200).json(result);
        }
    });
});

module.exports = router;
