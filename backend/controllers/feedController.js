// backend/controllers/feedController.js
const db = require('../db');

exports.getFeed = async (req, res) => {
    const loggedInUserId = req.user?.id;
    console.log('Logged-in User ID:', loggedInUserId); // Debugging log for logged-in user ID
    
    if (!loggedInUserId) {
        console.log('Authentication required to view feed.');
        return res.status(401).json({ message: 'Authentication required to view feed.' });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    console.log(`Fetching feed: page ${page}, limit ${limit}, offset ${offset}`); // Debugging log for pagination params

    try {
        const feedResult = await db.query(
            `SELECT p.id, p.user_id, p.name, p.headline, p.bio, p.photo_url, p.interests, p.updated_at, u.email
             FROM profiles p
             JOIN users u ON p.user_id = u.id
             WHERE p.user_id != $1
             ORDER BY p.updated_at DESC
             LIMIT $2 OFFSET $3`,
             [loggedInUserId, limit, offset]
         );

        // Debugging log: Check if profiles are returned
        console.log('Feed query result:', feedResult.rows); 

        if (feedResult.rows.length === 0) {
            console.log('No profiles found for the feed.');
        }

        const totalCountResult = await db.query(
            'SELECT COUNT(*) FROM profiles WHERE user_id != $1',
            [loggedInUserId]
        );

        const totalProfiles = parseInt(totalCountResult.rows[0].count);
        const totalPages = Math.ceil(totalProfiles / limit);

        console.log('Total profiles:', totalProfiles);
        console.log('Total pages:', totalPages);

        res.status(200).json({
            profiles: feedResult.rows,
            pagination: {
                currentPage: page,
                totalPages: totalPages,
                totalProfiles: totalProfiles,
                limit: limit
            }
        });
    } catch (error) {
        console.error('Get Feed Error:', error);
        res.status(500).json({ message: 'Error retrieving feed.' });
    }
};



// // backend/controllers/feedController.js
// const db = require('../db');

// exports.getFeed = async (req, res) => {
//     // The JWT middleware (added later) will put user info in req.user
//     const loggedInUserId = req.user?.id;
//     if (!loggedInUserId) {
//          // If the feed strictly requires login per the spec
//          return res.status(401).json({ message: 'Authentication required to view feed.' });
//          // If it *can* be public but excludes user if logged in, handle differently
//     }


//     // Pagination (Example: /api/feed?page=1&limit=10)
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 10; // Default limit to 10 profiles per page
//     const offset = (page - 1) * limit;


//     try {
//          // Query to get profiles, excluding the logged-in user's profile
//          // Select only necessary fields to send to the frontend
//          const feedResult = await db.query(
//             `SELECT p.id, p.user_id, p.name, p.headline, p.bio, p.photo_url, p.interests, p.updated_at, u.email
//              FROM profiles p
//              JOIN users u ON p.user_id = u.id -- Join to get user email if needed
//              WHERE p.user_id != $1 -- Exclude logged-in user
//              ORDER BY p.updated_at DESC -- Order by most recently updated
//              LIMIT $2 OFFSET $3`,
//              [loggedInUserId, limit, offset]
//          );

//          // Optional: Get total count for pagination metadata
//          const totalCountResult = await db.query(
//              'SELECT COUNT(*) FROM profiles WHERE user_id != $1',
//              [loggedInUserId]
//          );
//          const totalProfiles = parseInt(totalCountResult.rows[0].count);
//          const totalPages = Math.ceil(totalProfiles / limit);


//         res.status(200).json({
//             profiles: feedResult.rows,
//             pagination: {
//                 currentPage: page,
//                 totalPages: totalPages,
//                 totalProfiles: totalProfiles,
//                 limit: limit
//             }
//         });
//     } catch (error) {
//         console.error('Get Feed Error:', error);
//         res.status(500).json({ message: 'Error retrieving feed.' });
//     }
// };