const express = require("express");
const { verifyToken, verifyAdmin } = require("../middleware/authMiddleware");
const { getAllUsers, registerUser, loginUser, suspendUser } = require("../controllers/userController");

const router = express.Router();

// Authentication Routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// User Routes
router.get("/", verifyToken, verifyAdmin, getAllUsers);
router.get("/admin", verifyAdmin, (req, res) => {
  res.json({ message: "Welcome Admin" });
});
router.get("/user", verifyToken, (req, res) => {
  res.json({ message: "Welcome User" });
});
router.put("/:id/suspend", verifyToken, verifyAdmin, suspendUser);

module.exports = router;
