const express = require("express")
const { placeorder, getAllOrder } = require("../controllers/orderController")
const { verifyToken, verifyAdmin } = require("../middleware/authMiddleware")

const router = express.Router();

router.post('/place-order', verifyToken, placeorder);
router.get("/all", verifyToken, verifyAdmin, getAllOrder);

module.exports = router;