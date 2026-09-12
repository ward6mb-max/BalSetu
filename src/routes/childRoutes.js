const express = require("express");
const router = express.Router();
const { createChild, getAllChildren, getChildById } = require("../controllers/childController");
const { verifyToken, requireRole } = require("../middleware/authMiddleware");

router.post("/", verifyToken, requireRole("ORGANISATION", "ADMIN"), createChild);
router.get("/", verifyToken, getAllChildren);
router.get("/:id", verifyToken, getChildById);

module.exports = router;