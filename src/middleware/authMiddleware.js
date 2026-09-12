const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "temporary_secret_change_this";

const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // attaches { userId, role } to the request
    next();
  } catch (err) {
    return res.status(403).json({ error: "Invalid or expired token." });
  }
};

// Optional: restrict access by role
const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: "Access denied for this role." });
    }
    next();
  };
};

module.exports = { verifyToken, requireRole };