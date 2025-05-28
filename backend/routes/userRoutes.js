const express = require("express");
const { verifyToken } = require("../middleware/authMiddleware")
const { roleMiddleware } = require("../middleware/roleMiddleware")
const router = express.Router();

//Only admin can access this router

router.get("/admin", verifyToken, roleMiddleware("admin"), (req, res) => {
  res.json({ message: "Welcome Admin" })
})

// All can access this router

router.get("/user", verifyToken, roleMiddleware("admin", "user"), (req, res) => {
  res.json({ message: "Welcome User" })
})


module.exports = router;