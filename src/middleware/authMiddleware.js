const supabase = require("../config/supabaseClient");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No token provided." });
    }

    const token = authHeader.split(" ")[1];

    // Verify token with Supabase
    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
      return res.status(403).json({ error: "Invalid or expired token." });
    }

    // Fetch the full profile (with role) from our own users table
    const userProfile = await prisma.users.findUnique({
      where: { id: data.user.id },
    });

    if (!userProfile) {
      return res.status(404).json({ error: "User profile not found." });
    }

    req.user = userProfile; // attaches { id, email, role, ... }
    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong verifying token." });
  }
};

const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: "Access denied for this role." });
    }
    next();
  };
};

module.exports = { verifyToken, requireRole };