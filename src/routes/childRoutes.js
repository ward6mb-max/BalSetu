const express = require("express");
const router = express.Router();
const { createChild, getAllChildren, getChildById } = require("../controllers/childController");
const { verifyToken, requireRole } = require("../middleware/authMiddleware");

// Only CHILD_ORG or ADMIN can create profiles
router.post("/", verifyToken, requireRole("CHILD_ORG", "ADMIN"), createChild);

// Anyone logged in can view the list (public-safe fields only)
router.get("/", verifyToken, getAllChildren);

// Anyone logged in can view one profile (full detail for now — we'll restrict later)
router.get("/:id", verifyToken, getChildById);

module.exports = router;
