const mysql = require('mysql2');

// Create MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'library_management'
});

// Connect to MySQL
db.connect((err) => {
    if (err) {
        console.error('Unable to connect to MySQL:', err);
    } else {
        console.log('Connected to MySQL database');
    }
});

module.exports = { db };
