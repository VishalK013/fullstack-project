const express = require("express");
const { verifyToken, verifyAdmin } = require("../middleware/authMiddleware");
const { createOrUpdateReview, getProductReviews, getAllReviews, getMyReviews } = require("../controllers/reviewController");
const router = express.Router();

router.post("/review", verifyToken, createOrUpdateReview);
router.get('/review/my-reviews', verifyToken, getMyReviews);//user all reviews
router.get("/review/:productId", verifyToken, getProductReviews);//for user side
router.get("/review/admin/all", verifyToken, verifyAdmin, getAllReviews); //for admin side

module.exports = router;