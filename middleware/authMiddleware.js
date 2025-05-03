const jwt = require('jsonwebtoken');

const User = require('../models/User');

const authMiddleware = (allowedRoles) => (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    return res.status(403).json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded Token:", decoded); // Debug line

    if (!allowedRoles.includes(decoded.role)) {
      return res.status(403).json({ message: "Access denied. Unauthorized role." });
    }

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token." });
  }
};


module.exports = authMiddleware;

