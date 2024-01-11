# Library Management System

This Library Management System is a simple yet effective application designed to manage books, borrowers, and borrowing processes. The system allows users to perform various operations such as adding, updating, and deleting books and borrowers. Additionally, it facilitates borrowing and returning books while keeping track of due dates and overdue books. The system is built with scalability, performance, and security in mind, offering a RESTful API for seamless integration with other applications.

## Setup Instructions:

### Clone the Repository:

```
git clone <repository-url>
cd <repository-directory>
```

### Install Dependencies:

`npm install`

### Run the Application:

`npm start`

This command will start the application using nodemon, which automatically restarts the server upon file changes.

### Access the API:
The API will be accessible at http://localhost:3000.


## API Endpoints:


### Books:


GET /books: List all books. Output: an object of all books and their details.

POST /books: Add a new book. input: title, author, ISBN, available quantity, and shelf location.

PUT /books/:id: Update book details. input: desired updated title, author, ISBN, available quantity, and shelf location.

DELETE /books/:id: Delete a book.

GET /books/search: Search for a book by title, author, or ISBN. input: title, author, or ISBN or a part of any of them. /output: an object of all books with the input charachters.


### Borrowers:


GET /borrowers: List all borrowers. output: an object of all borrowers details.

POST /borrowers: Register a new borrower. input: name, email, and registered date.

PUT /borrowers/:id: Update borrower details. input: desired updated name, email, and registered date.

DELETE /borrowers/:id: Delete a borrower


### Borrowing Process:


GET /borrowings: List all borrowing processes. output: an object of all borrowing processes with details

POST /borrowings: Borrow a book. input: BookId, BorrowerId and check out date.

PUT /borrowings/:id/return: Return a book. input: returnDate.

GET /borrowings/:borrowerId: List books currently borrowed by a borrower. input: BorrowerId./ output: an object of all borrowed books by that Id.

GET /borrowings/overdue: List overdue books. output: an object of all overdue books.


## Additional Features:


### Analytical Reports:


/analytics/exports/borrowing-processes-xlsx: Export borrowing process data in Xlsx format for a specific period.

/analytics/exports/overdue-borrows-xlsx: Export all overdue borrows of the last month in Xlsx format.

/analytics/exports/borrowing-processes-last-month-xlsx: Export all borrowing processes of the last month in Xlsx format.


### Rate Limiting:

Rate limiting is applied to the following endpoints to prevent abuse:

/books (GET and POST)

/borrowings (GET and POST)

Authentication:
Basic authentication is implemented for the API. Provide valid credentials when making API requests.

With these instructions, you should have the Library Management System up and running, ready to efficiently manage books, borrowers, and borrowing processes.
