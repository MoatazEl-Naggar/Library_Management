const express = require('express');
const { db } = require('../db');

const router = express.Router();

// Register a borrower
router.post('/', (req, res) => {
    const { name, email } = req.body;

    // Check if the borrower with the given email already exists
    const checkBorrowerQuery = 'SELECT id FROM borrowers WHERE email = ?';
    db.query(checkBorrowerQuery, [email], (checkErr, checkResult) => {
        if (checkErr) {
            console.error('Error checking borrower:', checkErr);
            res.status(500).send('Error checking borrower');
            return;
        }

        if (checkResult.length > 0) {
            // Borrower with the given email already exists
            res.status(400).send('Borrower with this email is already registered');
        } else {
            // Borrower with the given email does not exist, insert a new borrower
            const registered_date = new Date().toISOString().slice(0, 10); // Get current date
            const addBorrowerQuery = 'INSERT INTO borrowers (name, email, registered_date) VALUES (?, ?, ?)';
            db.query(addBorrowerQuery, [name, email, registered_date], (addErr, addResult) => {
                if (addErr) {
                    console.error('Error adding borrower:', addErr);
                    res.status(500).send('Error adding borrower');
                } else {
                    res.status(201).send('Borrower added successfully');
                }
            });
        }
    });
});



// Update borrower's details
router.put('/:id', (req, res) => {
    const borrowerId = req.params.id;
    const { name, email, registered_date } = req.body;
    const updateBorrowerQuery = 'UPDATE borrowers SET name=?, email=?, registered_date=? WHERE id=?';
    db.query(updateBorrowerQuery, [name, email, registered_date, borrowerId], (err, result) => {
        if (err) {
            console.error('Error updating borrower:', err);
            res.status(500).send('Error updating borrower');
        } else {
            res.status(200).send('Borrower updated successfully');
        }
    });
});

// Delete a borrower
router.delete('/:id', (req, res) => {
    const borrowerId = req.params.id;
    const deleteBorrowerQuery = 'DELETE FROM borrowers WHERE id=?';
    db.query(deleteBorrowerQuery, [borrowerId], (err, result) => {
        if (err) {
            console.error('Error deleting borrower:', err);
            res.status(500).send('Error deleting borrower');
        } else {
            res.status(200).send('Borrower deleted successfully');
        }
    });
});

// List all borrowers
router.get('/', (req, res) => {
    const listBorrowersQuery = 'SELECT * FROM borrowers';
    db.query(listBorrowersQuery, (err, result) => {
        if (err) {
            console.error('Error listing borrowers:', err);
            res.status(500).send('Error listing borrowers');
        } else {
            res.status(200).json(result);
        }
    });
});

module.exports = router;
