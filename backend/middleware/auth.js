// backend/middleware/auth.js
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

const authenticateToken = (req, res, next) => {
    console.log('Auth Middleware Triggered for:', req.path); // Log path
    const authHeader = req.headers['authorization'];
    console.log('Authorization Header Received:', authHeader); // Log the raw header

    const token = authHeader && authHeader.split(' ')[1]; // Extract token part
    console.log('Extracted Token:', token); // Log the extracted token

    if (token == null) {
        console.log('No token found, sending 401');
        return res.sendStatus(401); // If no token, unauthorized
    }

    jwt.verify(token, JWT_SECRET, (err, userPayload) => {
        if (err) {
            // Log the specific error!
            console.error("JWT Verification Error:", err.name, err.message);
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({ message: 'Token expired' });
            }
             // For any other verification error (bad secret, malformed token)
            return res.status(403).json({ message: 'Token verification failed', error: err.message }); // Use 403 Forbidden for invalid token
        }

        // If token is valid
        console.log('JWT Verified Successfully. Payload:', userPayload);
        req.user = userPayload; // Attach payload to request
        next(); // Proceed to the next middleware or route handler
    });
};

module.exports = authenticateToken;