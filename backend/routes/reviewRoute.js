const express = require("express");
const { verifyToken, verifyAdmin } = require("../middleware/authMiddleware");
const { createOrUpdateReview, getProductReviews, getMyReviews, getReviewsByProductId, deleteReview } = require("../controllers/reviewController");
const router = express.Router();

router.post("/post", verifyToken, createOrUpdateReview);
router.get('/my-reviews', verifyToken, getMyReviews);//user all reviews
router.get("/:productId", verifyToken, getProductReviews);//for user side
router.get("/product/:productId", verifyToken, getReviewsByProductId); //for admin side
router.delete("/:id", verifyToken, verifyAdmin, deleteReview);

module.exports = router;