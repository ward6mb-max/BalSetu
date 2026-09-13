const express = require("express");
const router = express.Router();
const { createChild, getAllChildren, getChildById } = require("../controllers/childController");
const { verifyToken, requireRole } = require("../middleware/authMiddleware");

router.post("/", verifyToken, requireRole("ORGANISATION", "ADMIN"), createChild);
router.get("/", getAllChildren);
router.get("/:id", getChildById);

module.exports = router;