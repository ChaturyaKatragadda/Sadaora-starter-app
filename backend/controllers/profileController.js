// backend/controllers/profileController.js
const db = require('../db');

// --- Create Profile (Often handled during signup, but providing separate endpoint) ---
// This assumes the user already exists, and we are creating their profile details.
// The `req.user.id` will come from the authentication middleware later.
exports.createProfile = async (req, res) => {
    // This assumes JWT middleware has added user info to req.user
    const userId = req.user?.userId; // Use optional chaining
    if (!userId) {
         return res.status(401).json({ message: 'Authentication required.' });
    }

    const { name, bio, headline, photo_url, interests } = req.body;
    // Basic validation for interests (ensure it's an array)
    const interestsArray = Array.isArray(interests) ? interests : (interests ? [interests] : []); // Handle single string or array


    try {
        // Check if profile already exists
        const existingProfile = await db.query('SELECT id FROM profiles WHERE user_id = $1', [userId]);
        if (existingProfile.rows.length > 0) {
            return res.status(409).json({ message: 'Profile already exists for this user. Use PUT to update.' });
        }

        const newProfile = await db.query(
            `INSERT INTO profiles (user_id, name, bio, headline, photo_url, interests)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING id, name, bio, headline, photo_url, interests`,
            [userId, name, bio, headline, photo_url, interestsArray]
        );
        res.status(201).json(newProfile.rows[0]);
    } catch (error) {
        console.error('Create Profile Error:', error);
        if (error.code === '23503') { // Foreign key violation (user_id doesn't exist)
             return res.status(400).json({ message: 'Invalid user ID.' });
        }
        res.status(500).json({ message: 'Error creating profile.' });
    }
};


// --- Get Profile (Logged-in User) ---
exports.getProfile = async (req, res) => {
    const userId = req.user?.id;
    if (!userId) {
        return res.status(401).json({ message: 'Authentication required.' });
    }

    try {
        const profileResult = await db.query(
            'SELECT id, user_id, name, bio, headline, photo_url, interests FROM profiles WHERE user_id = $1',
            [userId]
        );

        if (profileResult.rows.length === 0) {
            // It's okay if a profile doesn't exist yet after signup
            return res.status(404).json({ message: 'Profile not found for this user.' });
        }

        res.status(200).json(profileResult.rows[0]);
    } catch (error) {
        console.error('Get Profile Error:', error);
        res.status(500).json({ message: 'Error retrieving profile.' });
    }
};

// --- Update Profile ---
exports.updateProfile = async (req, res) => {
    const userId = req.user?.id;
    if (!userId) {
         return res.status(401).json({ message: 'Authentication required.' });
    }

    const { name, bio, headline, photo_url, interests } = req.body;
     // Basic validation for interests (ensure it's an array)
    const interestsArray = Array.isArray(interests) ? interests : (interests ? [interests] : null); // Use null if not provided to avoid overwriting with empty array

    // Build the update query dynamically based on provided fields
    let query = 'UPDATE profiles SET ';
    const values = [];
    let paramIndex = 1;

    if (name !== undefined) { query += `name = $${paramIndex++}, `; values.push(name); }
    if (bio !== undefined) { query += `bio = $${paramIndex++}, `; values.push(bio); }
    if (headline !== undefined) { query += `headline = $${paramIndex++}, `; values.push(headline); }
    if (photo_url !== undefined) { query += `photo_url = $${paramIndex++}, `; values.push(photo_url); }
    if (interestsArray !== null) { query += `interests = $${paramIndex++}, `; values.push(interestsArray); }

    // Add updated_at timestamp manually if not using trigger, or let trigger handle it
    query += `updated_at = CURRENT_TIMESTAMP `; // Ensure comma removed if last field

    // Remove trailing comma and space if any fields were added
     if (values.length > 0) {
        query = query.replace(/, $/, ' '); // Remove trailing comma if it exists
     } else {
        // No fields provided to update
        return res.status(400).json({ message: 'No fields provided for update.' });
     }


    query += `WHERE user_id = $${paramIndex++} RETURNING id, name, bio, headline, photo_url, interests`;
    values.push(userId);

    try {
        const updatedProfile = await db.query(query, values);

        if (updatedProfile.rows.length === 0) {
            return res.status(404).json({ message: 'Profile not found or user mismatch.' });
        }

        res.status(200).json(updatedProfile.rows[0]);
    } catch (error) {
        console.error('Update Profile Error:', error);
        res.status(500).json({ message: 'Error updating profile.' });
    }
};

// --- Delete Profile ---
// Consider carefully if this should delete the *user* or just the *profile data*
// This implementation deletes only the profile data.
exports.deleteProfile = async (req, res) => {
   const userId = req.user?.id;
    if (!userId) {
         return res.status(401).json({ message: 'Authentication required.' });
    }

    try {
        // You might want to delete the user as well, which would cascade delete the profile
        // await db.query('DELETE FROM users WHERE id = $1', [userId]);

        // Or just delete the profile row
        const deleteResult = await db.query('DELETE FROM profiles WHERE user_id = $1 RETURNING id', [userId]);

        if (deleteResult.rowCount === 0) {
             return res.status(404).json({ message: 'Profile not found for this user.' });
        }


        res.status(200).json({ message: 'Profile deleted successfully.' }); // 204 No Content is also common for DELETE
    } catch (error) {
        console.error('Delete Profile Error:', error);
        res.status(500).json({ message: 'Error deleting profile.' });
    }
};