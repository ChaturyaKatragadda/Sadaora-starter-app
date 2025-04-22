// backend/controllers/authController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db'); // Import the database query function

const SALT_ROUNDS = 10; // Cost factor for bcrypt hashing
const JWT_SECRET = process.env.JWT_SECRET;

// --- Signup Handler ---
exports.signup = async (req, res) => {
  const { email, password, name } = req.body; // also read 'name' from frontend

  // Basic Input Validation
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }
  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
  }

  try {
    // 1. Check if user already exists
    const existingUser = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(409).json({ message: 'Email already in use.' });
    }

    // 2. Hash the password
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    // 3. Insert new user into database
    const newUserResult = await db.query(
      'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email',
      [email, passwordHash]
    );
    const newUser = newUserResult.rows[0];

    console.log('--- About to add initial profile for user', newUser.id);

    // 4. Create a basic profile for the new user
    await db.query('INSERT INTO profiles (user_id, name) VALUES ($1, $2)', [newUser.id, name || '']);

    // 5. Generate JWT token
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email }, // <-- FIXED: using newUser
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    // 6. Send success response
    res.status(201).json({
      message: 'User created successfully!',
      token: token,
      user: { id: newUser.id, email: newUser.email }
    });

  } catch (error) {
    console.error('*** Signup fatal error:', error.message);
    console.error(error.stack);
    return res.status(500).json({ message: 'Error registering user.', details: error.message });
  }
};

// --- Login Handler ---
exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    // 1. Find user by email
    const userResult = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userResult.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }
    const user = userResult.rows[0];

    // 2. Compare provided password with stored hash
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    // 3. Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    // 4. Optionally fetch profile data
    const profileResult = await db.query(
      'SELECT id, name, headline, photo_url, interests, bio FROM profiles WHERE user_id = $1',
      [user.id]
    );
    const profile = profileResult.rows[0] || null;

    // 5. Send success response
    res.status(200).json({
      message: 'Login successful!',
      token: token,
      user: { id: user.id, email: user.email },
      profile: profile
    });

  } catch (error) {
    console.error('Login Error:', error.message);
    console.error(error.stack);
    res.status(500).json({ message: 'Error logging in.', details: error.message });
  }
};


// // backend/controllers/authController.js
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const db = require('../db'); // Import the database query function

// const SALT_ROUNDS = 10; // Cost factor for bcrypt hashing
// const JWT_SECRET = process.env.JWT_SECRET;

// // --- Signup Handler ---
// exports.signup = async (req, res) => {
//     const { email, password } = req.body;

//     // Basic Input Validation
//     if (!email || !password) {
//         return res.status(400).json({ message: 'Email and password are required.' });
//     }
//     if (password.length < 6) { // Example: Minimum password length
//          return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
//     }

//     try {
//         // Check if user already exists
//         const existingUser = await db.query('SELECT * FROM users WHERE email = $1', [email]);
//         if (existingUser.rows.length > 0) {
//             return res.status(409).json({ message: 'Email already in use.' }); // 409 Conflict
//         }

//         // Hash the password
//         const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

//         // Insert new user into the database
//         const newUserResult = await db.query(
//             'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email',
//             [email, passwordHash]
//         );
//         const newUser = newUserResult.rows[0];

//         console.log('--- About to add initial profile for user', newUser.id);
//          // Create a profile entry (can be basic initially or handle in profile creation endpoint)
//         await db.query('INSERT INTO profiles (user_id, name) VALUES ($1, $2)', [newUser.id, '']); // Add user_id, leave name blank for now
//         // or pass real name from req.body if you want
//         // Generate JWT token
//         // const token = jwt.sign(
//         //     { userId: newUser.id, email: newUser.email }, // Payload
//         //     JWT_SECRET,
//         //     { expiresIn: '1h' } // Token expiry time (e.g., 1 hour)
//         // );
//         const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
//         res.status(201).json({
//             message: 'User created successfully!',
//             token: token,
//             user: { id: newUser.id, email: newUser.email } // Don't send password hash
//         });

//     // } catch (error) {
//     //     console.error('Signup Error:', error);
//     //     res.status(500).json({ message: 'Error registering user.' });
//     // }
// } catch (error) {
//     console.error('*** Signup fatal error', error);   // <─ ADD THIS
//     return res.status(500).json({ message: error.message }); // expose message
//   }
// };

// // --- Login Handler ---
// exports.login = async (req, res) => {
//     const { email, password } = req.body;

//     if (!email || !password) {
//         return res.status(400).json({ message: 'Email and password are required.' });
//     }

//     try {
//         // Find user by email
//         const userResult = await db.query('SELECT * FROM users WHERE email = $1', [email]);
//         if (userResult.rows.length === 0) {
//             return res.status(401).json({ message: 'Invalid credentials.' }); // Use generic message
//         }
//         const user = userResult.rows[0];

//         // Compare provided password with stored hash
//         const isMatch = await bcrypt.compare(password, user.password_hash);
//         if (!isMatch) {
//             return res.status(401).json({ message: 'Invalid credentials.' });
//         }

//         // Generate JWT token
//         // const token = jwt.sign(
//         //     { userId: user.id, email: user.email },
//         //     JWT_SECRET,
//         //     { expiresIn: '1h' });

//             const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
        

//          // Optionally fetch profile data on login
//          const profileResult = await db.query('SELECT id, name, headline, photo_url, interests, bio FROM profiles WHERE user_id = $1', [user.id]);
//          const profile = profileResult.rows[0] || null; // Handle case where profile might not exist yet


//         res.status(200).json({
//             message: 'Login successful!',
//             token: token,
//             user: { id: user.id, email: user.email },
//             profile: profile // Send profile data along with user info
//         });

//     } catch (error) {
//         console.error('Login Error:', error);
//         res.status(500).json({ message: 'Error logging in.' });
//     }
// };