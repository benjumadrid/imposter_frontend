const mysql = require('mysql2');

// Create the connection pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',         // put your password if you have one
  database: 'book_db'
});

// Test connection once on startup
pool.getConnection((err, connection) => {
  if (err) {
    console.error('Database connection failed:', err.message);
  } else {
    console.log('Connected to MySQL database successfully!');
    connection.release(); // release the connection back to pool
  }
});

module.exports = pool.promise();
