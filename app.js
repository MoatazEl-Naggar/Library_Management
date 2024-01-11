const express = require('express');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');
const basicAuth = require('express-basic-auth');

const { createTables } = require('./db');
const booksRouter = require('./routes/booksOps');
const borrowersRouter = require('./routes/borrowerOps');
const borrowingsRouter = require('./routes/borrowingOps');
const analyticsRouter = require('./routes/analytics');

const app = express();
const port = 3000;

app.use(bodyParser.json());

// Apply rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
});

// Basic Authentication
const users = { 'admin': '123456' };
app.use(basicAuth({ users, challenge: true }));

// Connect to MySQL and create tables
createTables();

// Book routes
app.use('/books', limiter, booksRouter);

// Borrower routes
app.use('/borrowers', limiter,  borrowersRouter);

// Borrowing process routes
app.use('/borrowings', borrowingsRouter);

// Analytics routes
app.use('/analytics', analyticsRouter);

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
