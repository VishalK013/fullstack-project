const express = require("express")
const router = express.Router();
const { getProductSummary, getOrderTrends } = require('../controllers/adminControllers');
const { verifyToken, verifyAdmin } = require("../middleware/authMiddleware");

router.get("/products/summary", verifyToken, verifyAdmin, getProductSummary)
router.get("/orders/trends", verifyToken, verifyAdmin, getOrderTrends)

module.exports = router;