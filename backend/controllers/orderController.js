const Order = require("../model/orderModel")
const Cart = require("../model/cartModel")

exports.placeorder = async (req, res) => {

    try {

        const userId = req.user.id;
        const { shippingAddress } = req.body;
        if (!shippingAddress) {
            return res.status(400).json({ message: "Shipping address is required" });
        }

        const cart = await Cart.findOne({ user: userId }).populate("items.product");
        console.log(cart);

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: "Cart is empty" })
        }

        const totalAmount = cart.items.reduce((sum, item) => sum + item.total, 0);

        const order = new Order({
            user: userId,
            items: cart.items.map((item) => ({
                product: item.product._id,
                quantity: item.quantity,
                price: item.price,
                total: item.total
            })),
            totalAmount,
            shippingAddress,
        })

        await order.save()

        cart.items = [];
        await cart.save();

        res.status(201).json({ message: "Order Placed Successfully ", orderId: order._id })

    } catch (error) {
        console.error('Place order error:', error);
        res.status(500).json({ message: error.message || 'Internal server error' });
    }

}

exports.getAllOrder = async (req, res) => {
    try {

        const orders = await Order.find().populate("user", "name email").populate("items.product", "name price image");

        res.status(200).json({ orders });

    } catch (error) {
        console.error("Get all orders error:", error);
        res.status(500).json({ message: error.message || "Internal server error" });
    }
};
