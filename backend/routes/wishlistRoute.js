const express = require("express");
const { verifyToken } = require("../middleware/authMiddleware");
const { addToWishList, getWishlist, removeWishList, getAllWishListCount } = require("../controllers/wishlistController");
const router = express.Router();


router.post("/add", verifyToken, addToWishList)
router.get("/get", verifyToken, getWishlist)
router.get("/all", verifyToken, getAllWishListCount)
router.delete("/remove/:id", verifyToken, removeWishList)

module.exports = router;