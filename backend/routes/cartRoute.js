const express = require('express');
const router = express.Router();
const { addToCart, getCart, removeFromCart } = require('../controllers/cartController');
const { verifyToken } = require('../middleware/authMiddleware');

router.post('/add', verifyToken, addToCart);
router.get('/get', verifyToken, getCart);
router.delete('/remove',verifyToken,removeFromCart)

module.exports = router;
