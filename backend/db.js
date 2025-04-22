// backend/db.js
const { Pool } = require('pg');
require('dotenv').config(); // Ensure environment variables are loaded

// Create a connection pool using the DATABASE_URL from .env
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Optional: Add SSL configuration if connecting to a cloud DB like AWS RDS
  // ssl: {
  //   rejectUnauthorized: false // Adjust based on your SSL requirements
  // }
});

// Test the connection (optional)
pool.connect((err, client, release) => {
  if (err) {
    return console.error('Error acquiring client', err.stack);
  }
  client.query('SELECT NOW()', (err, result) => {
    release(); // Release the client back to the pool
    if (err) {
      return console.error('Error executing query', err.stack);
    }
    console.log('Successfully connected to PostgreSQL database.');
  });
});

// Export a query function to interact with the database
module.exports = {
  query: (text, params) => pool.query(text, params),
  pool: pool // Export pool if needed directly elsewhere
};