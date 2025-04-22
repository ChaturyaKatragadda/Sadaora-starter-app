// const express = require('express');
// const { Pool } = require('pg');
// const authMiddleware = require('../middleware/authMiddleware');

// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
// });

// const router = express.Router();

// // Apply authMiddleware to protect the feed route
// router.use(authMiddleware);

// // GET /api/feed - Get a public feed of all user profiles (excluding the logged-in user's)
// router.get('/', async (req, res) => {
//   const { page = 1, limit = 10 } = req.query; // Basic pagination

//   try {
//     const offset = (page - 1) * limit;
//     const feedResult = await pool.query(
//       'SELECT p.*, u.email FROM profiles p JOIN users u ON p.user_id = u.id WHERE p.user_id != $1 ORDER BY p.created_at DESC LIMIT $2 OFFSET $3',
//       [req.user.userId, limit, offset]
//     );

//     const totalCountResult = await pool.query('SELECT COUNT(*) FROM profiles WHERE user_id != $1', [req.user.userId]);
//     const totalCount = parseInt(totalCountResult.rows[0].count);
//     const totalPages = Math.ceil(totalCount / limit);

//     res.json({
//       profiles: feedResult.rows,
//       currentPage: parseInt(page),
//       totalPages,
//       totalCount,
//     });
//   } catch (error) {
//     console.error('Error fetching public feed:', error);
//     res.status(500).json({ error: 'Failed to fetch public feed.' });
//   }
// });

// module.exports = router;

//================================================================================
// backend/routes/feed.js
const express = require('express');
const feedController = require('../controllers/feedController'); // We will create this next

const router = express.Router();

// GET /api/feed - Get public feed (excluding logged-in user)
router.get('/', feedController.getFeed);

module.exports = router;