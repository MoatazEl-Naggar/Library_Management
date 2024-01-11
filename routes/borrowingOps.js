const express = require('express');
const { db } = require('../db');

const router = express.Router();

// Borrow a book
router.post('/', (req, res) => {
    const { book_id, borrower_id, due_date } = req.body;
    const checkoutDate = new Date().toISOString().slice(0, 10); // Get current date

    // Check if the book is available
    const checkAvailabilityQuery = 'SELECT quantity FROM books WHERE id=?';
    db.query(checkAvailabilityQuery, [book_id], (availabilityErr, availabilityResult) => {
        if (availabilityErr) {
            console.error('Error checking book availability:', availabilityErr);
            res.status(500).send('Error checking book availability');
            return;
        }

        const quantity = availabilityResult[0].quantity;

        if (quantity <= 0) {
            res.status(400).send('Book is not available for checkout');
        } else {
            // Check if the borrower already has the book checked out
            const checkBorrowingQuery = 'SELECT id FROM borrowings WHERE book_id=? AND borrower_id=? AND return_date IS NULL';
            db.query(checkBorrowingQuery, [book_id, borrower_id], (borrowingErr, borrowingResult) => {
                if (borrowingErr) {
                    console.error('Error checking borrower\'s active borrowing:', borrowingErr);
                    res.status(500).send('Error checking borrower\'s active borrowing');
                    return;
                }

                if (borrowingResult.length > 0) {
                    // Borrower already has the book checked out
                    res.status(400).send('Borrower already has the book checked out');
                } else {
                    // Update book quantity
                    const updateQuantityQuery = 'UPDATE books SET quantity=? WHERE id=?';
                    db.query(updateQuantityQuery, [quantity - 1, book_id], (updateErr, updateResult) => {
                        if (updateErr) {
                            console.error('Error updating book quantity:', updateErr);
                            res.status(500).send('Error updating book quantity');
                        } else {
                            // Insert borrowing record
                            const insertBorrowingQuery = 'INSERT INTO borrowings (book_id, borrower_id, checkout_date, due_date) VALUES (?, ?, ?, ?)';
                            db.query(insertBorrowingQuery, [book_id, borrower_id, checkoutDate, due_date], (insertErr, insertResult) => {
                                if (insertErr) {
                                    console.error('Error inserting borrowing record:', insertErr);
                                    res.status(500).send('Error inserting borrowing record');
                                } else {
                                    res.status(201).send('Book checked out successfully');
                                }
                            });
                        }
                    });
                }
            });
        }
    });
});


// Return a book
router.put('/:id', (req, res) => {
    const borrowingId = req.params.id;
    const returnDate = new Date().toISOString().slice(0, 10); // Get current date

    // Update borrowing record with return date
    const returnBookQuery = 'UPDATE borrowings SET return_date=? WHERE id=?';
    db.query(returnBookQuery, [returnDate, borrowingId], (returnErr, returnResult) => {
        if (returnErr) {
            console.error('Error returning book:', returnErr);
            res.status(500).send('Error returning book');
            return;
        }

        // Update book quantity
        const updateBookQuery = 'UPDATE books SET quantity = quantity + 1 WHERE id = (SELECT book_id FROM borrowings WHERE id = ?)';
        db.query(updateBookQuery, [borrowingId], (updateErr, updateResult) => {
            if (updateErr) {
                console.error('Error updating book quantity after return:', updateErr);
                res.status(500).send('Error updating book quantity after return');
            } else {
                if (updateResult.affectedRows === 0) {
                    // No rows were affected in the books table, indicating an issue
                    console.error('No rows were affected when updating book quantity after return');
                    res.status(500).send('Error updating book quantity after return');
                } else {
                    res.status(200).send('Book returned successfully');
                }
            }
        });
    });
});



// List all books checked out by a borrower
router.get('/borrower/:id', (req, res) => {
    const borrowerId = req.params.id;
    const listBorrowedBooksQuery = 'SELECT b.title, b.author, b.isbn, br.checkout_date, br.due_date, br.return_date FROM borrowings br JOIN books b ON br.book_id = b.id WHERE br.borrower_id=? AND br.return_date IS NULL';
    db.query(listBorrowedBooksQuery, [borrowerId], (err, result) => {
        if (err) {
            console.error('Error listing borrowed books:', err);
            res.status(500).send('Error listing borrowed books');
        } else {
            res.status(200).json(result);
        }
    });
});

// List overdue books
router.get('/overdue', (req, res) => {
    const currentDate = new Date().toISOString().slice(0, 10);
    const listOverdueBooksQuery = 'SELECT b.title, b.author, b.isbn, br.checkout_date, br.due_date FROM borrowings br JOIN books b ON br.book_id = b.id WHERE br.return_date IS NULL AND br.due_date < ?';
    db.query(listOverdueBooksQuery, [currentDate], (err, result) => {
        if (err) {
            console.error('Error listing overdue books:', err);
            res.status(500).send('Error listing overdue books');
        } else {
            res.status(200).json(result);
        }
    });
});

module.exports = router;
