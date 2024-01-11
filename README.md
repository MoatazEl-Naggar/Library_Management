# Library Management System

This Library Management System is a simple yet effective application designed to manage books, borrowers, and borrowing processes. The system allows users to perform various operations such as adding, updating, and deleting books and borrowers. Additionally, it facilitates borrowing and returning books while keeping track of due dates and overdue books. The system is built with scalability, performance, and security in mind, offering a RESTful API for seamless integration with other applications.

Setup Instructions:

Clone the Repository:

```
git clone <repository-url>
cd <repository-directory>
```

Install Dependencies:

`npm install`

Database Configuration:

Create a MySQL database and configure the connection details in config.js.

Run the Application:

`npm start`

This command will start the application using nodemon, which automatically restarts the server upon file changes.

Access the API:
The API will be accessible at http://localhost:3000.

API Endpoints:

Books:

GET /books: List all books
POST /books: Add a new book
PUT /books/:id: Update book details
DELETE /books/:id: Delete a book
GET /books/search: Search for a book by title, author, or ISBN

Borrowers:

GET /borrowers: List all borrowers
POST /borrowers: Register a new borrower
PUT /borrowers/:id: Update borrower details
DELETE /borrowers/:id: Delete a borrower

Borrowing Process:

GET /borrowings: List all borrowing processes
POST /borrowings: Borrow a book
PUT /borrowings/:id/return: Return a book
GET /borrowings/:borrowerId: List books currently borrowed by a borrower
GET /borrowings/overdue: List overdue books

Additional Features:

Analytical Reports:

/analytics/exports/borrowing-processes-xlsx: Export borrowing process data in Xlsx format for a specific period.
/analytics/exports/overdue-borrows-xlsx: Export all overdue borrows of the last month in Xlsx format.
/analytics/exports/borrowing-processes-last-month-xlsx: Export all borrowing processes of the last month in Xlsx format.

Rate Limiting:

Rate limiting is applied to the following endpoints to prevent abuse:
/books (GET and POST)
/borrowings (GET and POST)

Authentication:
Basic authentication is implemented for the API. Provide valid credentials when making API requests.

With these instructions, you should have the Library Management System up and running, ready to efficiently manage books, borrowers, and borrowing processes.
