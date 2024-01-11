const express = require('express');
const { db } = require('../db');
const XLSX = require('xlsx');

const router = express.Router();

let currentDate = new Date();
let lastMonthDate = new Date();

// Check if the current month is January and adjust the year accordingly
if (currentDate.getMonth() === 1) {
    lastMonthDate.setMonth(12); // Set to December
    lastMonthDate.setFullYear(currentDate.getFullYear() - 1); // Adjust the year
} else {
    lastMonthDate.setMonth(currentDate.getMonth() - 1); // Set to the previous month
}

// Format dates as 'YYYY-MM-DD'
let currentDateFormatted = currentDate.toISOString().split('T')[0];
let lastMonthDateFormatted = lastMonthDate.toISOString().split('T')[0];

// Analytical report: Borrowing processes in a specific period in Xlsx
router.get('/exports/borrowing-processes-xlsx', (req, res) => {
    const { startDate, endDate } = req.query;

    // Fetch borrowing processes data with book title and borrower name from the database based on the given period
    const fetchBorrowingProcessesQuery = `
    SELECT 
      br.id AS borrowing_id,
      b.title AS book_title,
      bo.name AS borrower_name,
      br.checkout_date,
      br.due_date,
      br.return_date
    FROM borrowings br
    JOIN books b ON br.book_id = b.id
    JOIN borrowers bo ON br.borrower_id = bo.id
    WHERE br.checkout_date BETWEEN ? AND ?
  `;

    db.query(fetchBorrowingProcessesQuery, [startDate, endDate], (err, result) => {
        if (err) {
            console.error('Error fetching borrowing processes data for Xlsx export:', err);
            res.status(500).send('Error fetching borrowing processes data for Xlsx export');
        } else {
            // Convert data to Xlsx format
            const ws = XLSX.utils.json_to_sheet(result);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'borrowing-processes');
            const xlsxData = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });

            // Set response headers for Xlsx download
            res.setHeader('Content-disposition', 'attachment; filename=borrowing-processes.xlsx');
            res.set('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.status(200).send(xlsxData);
        }
    });
});

// Analytical report: all overdue borrows of the last month in Xlsx format
router.get('/exports/overdue-borrows-xlsx', (req, res) => {

    // Fetch overdue borrows data with book title and borrower name from the database for the last month
    const fetchOverdueBorrowsQuery = `
    SELECT 
      br.id AS borrowing_id,
      b.title AS book_title,
      bo.name AS borrower_name,
      br.checkout_date,
      br.due_date,
      br.return_date
    FROM borrowings br
    JOIN books b ON br.book_id = b.id
    JOIN borrowers bo ON br.borrower_id = bo.id
    WHERE br.return_date IS NULL AND br.due_date < ? AND br.due_date >= ?
  `;

    db.query(fetchOverdueBorrowsQuery, [currentDateFormatted, lastMonthDateFormatted], (err, result) => {
        if (err) {
            console.error('Error fetching overdue borrows data for Xlsx export:', err);
            res.status(500).send('Error fetching overdue borrows data for Xlsx export');
        } else {
            // Convert data to Xlsx format
            const ws = XLSX.utils.json_to_sheet(result);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'overdue-borrows');
            const xlsxData = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });

            // Set response headers for Xlsx download
            res.setHeader('Content-disposition', 'attachment; filename=overdue-borrows.xlsx');
            res.set('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.status(200).send(xlsxData);
        }
    });
});

// Analytical report: all borrowing processes of the last month in Xlsx format
router.get('/exports/borrowing-processes-last-month-xlsx', (req, res) => {

    // Fetch borrowing processes data with book title and borrower name for the last month
    const fetchBorrowingProcessesQuery = `
    SELECT 
      br.id AS borrowing_id,
      b.title AS book_title,
      bo.name AS borrower_name,
      br.checkout_date,
      br.due_date,
      br.return_date
    FROM borrowings br
    JOIN books b ON br.book_id = b.id
    JOIN borrowers bo ON br.borrower_id = bo.id
    WHERE br.checkout_date BETWEEN ? AND ?
  `;

    db.query(fetchBorrowingProcessesQuery, [lastMonthDateFormatted, currentDateFormatted], (err, result) => {
        if (err) {
            console.error('Error fetching borrowing processes data for last month in Xlsx export:', err);
            res.status(500).send('Error fetching borrowing processes data for last month in Xlsx export');
        } else {
            // Convert data to Xlsx format
            const ws = XLSX.utils.json_to_sheet(result);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'borrowing-processes-last-month');
            const xlsxData = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });

            // Set response headers for Xlsx download
            res.setHeader('Content-disposition', 'attachment; filename=borrowing-processes-last-month.xlsx');
            res.set('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.status(200).send(xlsxData);
        }
    });
});

module.exports = router;
