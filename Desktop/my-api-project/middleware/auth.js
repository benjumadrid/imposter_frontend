const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  // Get token from headers
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ message: 'No token provided' });

  // Extract token (Bearer <token>)
  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Invalid token format' });

  // Verify token
  jwt.verify(token, 'your_jwt_secret', (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Token is invalid or expired' });

    // Save decoded info to request object
    req.user = decoded;
    next(); // Continue to the route
  });
};

module.exports = verifyToken;
