const express = require("express")
const { placeorder, getAllOrder, getUsersOrder, getUserOrderCount, getAllOrderCount, updateOrderStatus } = require("../controllers/orderController")
const { verifyToken, verifyAdmin } = require("../middleware/authMiddleware")

const router = express.Router();

router.post('/place-order', verifyToken, placeorder);
router.get("/all", verifyToken, verifyAdmin, getAllOrder);
router.get("/count-all", verifyToken, verifyAdmin, getAllOrderCount);
router.get("/my", verifyToken, getUsersOrder);
router.get("/count", verifyToken, getUserOrderCount);
router.put("/update-status", verifyToken, verifyAdmin, updateOrderStatus);


module.exports = router;