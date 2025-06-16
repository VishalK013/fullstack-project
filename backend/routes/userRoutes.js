const express = require("express");
const { verifyToken, verifyAdmin } = require("../middleware/authMiddleware");
const { getAllUsers, registerUser, loginUser, suspendUser, updateUserprofile, getAllUserCount } = require("../controllers/userController");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

// Authentication Routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// User Routes
router.get("/", verifyToken, verifyAdmin, getAllUsers);
router.get("/all", verifyToken, verifyAdmin, getAllUserCount);
router.get("/admin", verifyAdmin, (req, res) => {
  res.json({ message: "Welcome Admin" });
});
router.get("/user", verifyToken, (req, res) => {
  res.json({ message: "Welcome User" });
});
router.put("/:id/suspend", verifyToken, verifyAdmin, suspendUser);
router.put("/update/:id", verifyToken, upload.single("image"), updateUserprofile);


module.exports = router;
