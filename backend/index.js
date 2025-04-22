// const express = require('express');
// const cors = require('cors');
// const dotenv = require('dotenv');
// const authRoutes = require('auth.js');
// const profileRoutes = require('profile.js');
// const feedRoutes = require('feed.js');

// dotenv.config();

// const app = express();
// const port = process.env.PORT || 3001;

// app.use(cors());
// app.use(express.json());

// app.get('/', (req, res) => {
//   res.send('Sadaora Backend is running!');
// });

// // Use the authentication routes
// app.use('/api/auth', authRoutes);

// // Use the profile routes, protected by authMiddleware
// app.use('/api/profile', profileRoutes);

// // Use the feed routes, protected by authMiddleware
// app.use('/api/feed', feedRoutes);

// app.listen(port, () => {
//   console.log(`Server listening on port ${port}`);
// });




//=============================================
// backend/index.js

// Load environment variables from .env file
require('dotenv').config();

const express = require('express');
const cors = require('cors');
// We will create this db connection module soon
// const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3001; // Use port 3001 for the backend

// --- Middleware ---
// Enable CORS for all routes (adjust origins in production)
// app.use(cors());
app.use(cors({
  origin: 'http://localhost:5173', // your frontend's dev server
  credentials: true, // if you send cookies (optional)
}));

// Parse JSON request bodies
app.use(express.json());

// --- Basic Route ---
app.get('/', (req, res) => {
  res.send('Sadaora Backend is Running!');
});
const authenticateToken = require('./middleware/auth'); // Import the middleware

// --- API Routes (We will add these later) ---
app.use('/api/auth', require('./routes/auth'));
app.use('/api/profile', require('./middleware/auth'), require('./routes/profile')); // Example applying middleware
app.use('/api/feed', require('./middleware/auth'), require('./routes/feed'));     // Example applying middleware

// --- Error Handling (Basic Example) ---
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});


// --- Start Server ---
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});