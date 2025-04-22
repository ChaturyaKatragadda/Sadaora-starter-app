// const express = require('express');
// const { Pool } = require('pg');
// const authMiddleware = require('../middleware/authMiddleware');

// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
// });

// const router = express.Router();

// // Middleware to ensure user exists
// const ensureUserExists = async (req, res, next) => {
//   try {
//     const userResult = await pool.query('SELECT id FROM users WHERE id = $1', [req.user.userId]);
//     if (userResult.rows.length === 0) {
//       return res.status(404).json({ error: 'User not found.' });
//     }
//     next();
//   } catch (error) {
//     console.error('Error checking user existence:', error);
//     res.status(500).json({ error: 'Internal server error.' });
//   }
// };

// // Apply authMiddleware to all profile routes to protect them
// router.use(authMiddleware);
// router.use(ensureUserExists); // Ensure the logged-in user exists

// // POST /api/profile - Create a new profile
// router.post('/', async (req, res) => {
//   const { name, bio, headline, photo_url, interests } = req.body;

//   try {
//     const existingProfile = await pool.query(
//       'SELECT id FROM profiles WHERE user_id = $1',
//       [req.user.userId]
//     );

//     if (existingProfile.rows.length > 0) {
//       return res.status(409).json({ error: 'Profile already exists for this user. Use PUT to update.' });
//     }

//     const newProfile = await pool.query(
//       'INSERT INTO profiles (user_id, name, bio, headline, photo_url, interests) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
//       [req.user.userId, name, bio, headline, photo_url, interests || []]
//     );

//     res.status(201).json(newProfile.rows[0]);
//   } catch (error) {
//     console.error('Error creating profile:', error);
//     res.status(500).json({ error: 'Failed to create profile.' });
//   }
// });

// // GET /api/profile - Get the logged-in user's profile
// router.get('/', async (req, res) => {
//   try {
//     const profileResult = await pool.query('SELECT * FROM profiles WHERE user_id = $1', [req.user.userId]);

//     if (profileResult.rows.length === 0) {
//       return res.status(404).json({ error: 'Profile not found for this user.' });
//     }

//     res.json(profileResult.rows[0]);
//   } catch (error) {
//     console.error('Error fetching profile:', error);
//     res.status(500).json({ error: 'Failed to fetch profile.' });
//   }
// });

// // PUT /api/profile - Update the logged-in user's profile
// router.put('/', async (req, res) => {
//   const { name, bio, headline, photo_url, interests } = req.body;

//   try {
//     const updatedProfile = await pool.query(
//       'UPDATE profiles SET name = $1, bio = $2, headline = $3, photo_url = $4, interests = $5, updated_at = NOW() WHERE user_id = $6 RETURNING *',
//       [name, bio, headline, photo_url, interests || [], req.user.userId]
//     );

//     if (updatedProfile.rows.length === 0) {
//       return res.status(404).json({ error: 'Profile not found for this user.' });
//     }

//     res.json(updatedProfile.rows[0]);
//   } catch (error) {
//     console.error('Error updating profile:', error);
//     res.status(500).json({ error: 'Failed to update profile.' });
//   }
// });

// // DELETE /api/profile - Delete the logged-in user's profile
// router.delete('/', async (req, res) => {
//   try {
//     const deleteResult = await pool.query('DELETE FROM profiles WHERE user_id = $1 RETURNING *', [req.user.userId]);

//     if (deleteResult.rows.length === 0) {
//       return res.status(404).json({ error: 'Profile not found for this user.' });
//     }

//     res.json({ message: 'Profile deleted successfully.' });
//   } catch (error) {
//     console.error('Error deleting profile:', error);
//     res.status(500).json({ error: 'Failed to delete profile.' });
//   }
// });

// module.exports = router;




// //================================================================================
// // backend/routes/profile.js
// const express = require('express');
// const profileController = require('../controllers/profileController'); // We will create this next

// const router = express.Router();

// // POST /api/profile - Create profile (usually done during signup, but can be separate)
// // If you create during signup, this might become PUT for initial setup
// router.post('/', profileController.createProfile); // Might remove if done at signup

// // GET /api/profile - Get logged-in user's profile
// router.get('/', profileController.getProfile);

// // PUT /api/profile - Update logged-in user's profile
// router.put('/', profileController.updateProfile);

// // DELETE /api/profile - Delete logged-in user's profile (and user account?) - Be careful with this!
// // Usually deleting a profile might mean deleting the user account entirely.
// // Let's assume for now it just deletes the profile data.
// router.delete('/', profileController.deleteProfile);

// module.exports = router;


// routes/profile.js

const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/authenticate');
const db = require('../db'); // PostgreSQL db connection

// Create or Update Profile
router.post('/profile', authenticateToken, async (req, res) => {
  const { name, bio, headline, photo, interests } = req.body;
  const userId = req.user.id;

  try {
    // Check if profile exists
    const existingProfile = await db.query('SELECT * FROM profiles WHERE user_id = $1', [userId]);

    if (existingProfile.rows.length > 0) {
      // Update profile
      await db.query(
        'UPDATE profiles SET name = $1, bio = $2, headline = $3, photo = $4, interests = $5 WHERE user_id = $6',
        [name, bio, headline, photo, interests, userId]
      );
      res.json({ message: 'Profile updated successfully' });
    } else {
      // Create profile
      await db.query(
        'INSERT INTO profiles (user_id, name, bio, headline, photo, interests) VALUES ($1, $2, $3, $4, $5, $6)',
        [userId, name, bio, headline, photo, interests]
      );
      res.json({ message: 'Profile created successfully' });
    }
  } catch (error) {
    console.error('Error saving profile:', error);
    res.status(500).json({ message: 'Failed to save profile' });
  }
});

// Get Logged-in User's Profile
router.get('/profile', authenticateToken, async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await db.query('SELECT * FROM profiles WHERE user_id = $1', [userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Failed to fetch profile' });
  }
});

// 🚀 NEW: Public Feed - Get All Other Profiles
router.get('/feed', authenticateToken, async (req, res) => {
  const currentUserId = req.user.id;

  try {
    const result = await db.query(
      'SELECT id, name, bio, headline, photo, interests FROM profiles WHERE user_id != $1',
      [currentUserId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Error loading feed:', error);
    res.status(500).json({ message: 'Failed to load feed' });
  }
});

// Delete Profile
router.delete('/profile', authenticateToken, async (req, res) => {
  const userId = req.user.id;

  try {
    await db.query('DELETE FROM profiles WHERE user_id = $1', [userId]);
    res.json({ message: 'Profile deleted successfully' });
  } catch (error) {
    console.error('Error deleting profile:', error);
    res.status(500).json({ message: 'Failed to delete profile' });
  }
});

module.exports = router;
