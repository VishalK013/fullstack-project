const express = require("express");
const { verifyToken, verifyAdmin } = require("../middleware/authMiddleware")
const { getAllUsers } = require("../controllers/userController")
const router = express.Router();

//Route to fetch all users

router.get("/", getAllUsers);

//Only admin can access this router

router.get("/admin", verifyToken, verifyAdmin, (req, res) => {
  res.json({ message: "Welcome Admin" })
})

// All can access this router

router.get("/user", verifyToken, roleMiddleware("admin", "user"), (req, res) => {
  res.json({ message: "Welcome User" })
})


module.exports = router;