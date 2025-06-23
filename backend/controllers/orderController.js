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

exports.getAllOrderCount = async (req, res) => {
    try {
        const count = await Order.countDocuments(); // counts all orders
        res.status(200).json({ count });
    } catch (error) {
        console.error("All order count fetch error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

exports.getUsersOrder = async (req, res) => {
    try {

        const userId = req.user.id;

        const orders = await Order.find({ user: userId })
            .populate("items.product", "name price image")
            .sort({ createdAt: -1 });

        res.status(200).json({ orders });
    } catch (error) {
        console.error("Get user orders error:", error);
        res.status(500).json({ message: error.message || "Internal server error" });
    }
}

exports.getUserOrderCount = async (req, res) => {
    try {
        const userId = req.user.id;
        const count = await Order.countDocuments({ user: userId });
        res.status(200).json({ count });
    } catch (error) {
        console.error("Order count fetch error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

exports.updateOrderStatus = async (req, res) => {
    try {

        const { orderId, status } = req.body;

        const order = await Order.findById(orderId).populate("user", "_id name")

        if (!order) {
            return res.status(404).json({ message: "Order not found..." })
        }

        if (order.status === "Delivered" || order.status === "Cancelled") {
            return res.status(404).json({ message: "Can not chnage status once it's Delivered or Cancelled" })
        }

        order.status = status;
        await order.save();

        const io = req.app.get("io");
        const onlineUsers = req.app.get("onlineUsers")

        const userId = order.user._id.toString();
        const socketId = onlineUsers[userId];

        if (socketId) {
            io.to(socketId).emit("order-status-updated", {
                orderId: order._id,
                newStatus: order.status,
                message: `Your order status was updated to "${status}"`,
            });
        }

        if (status === "Delivered") {
            io.to(socketId).emit("order-delivered", {
                orderId: order._id,
                message: `Your order has been delivered! Please review and rate our products`
            })
            console.log("Order id ", orderId)
        }

        res.status(200).json({ message: "Order status updated", order });

    } catch (error) {
        console.error("Update order status error:", error);
        res.status(500).json({ message: error.message || "Internal server error" });
    }
}

exports.cancleOrder = async (req, res) => {
    try {

        const orderId = req.params.id;
        const order = await Order.findById(orderId)

        if (!order) {
            return res.status(404).json({ message: "Order not found..." })
        }

        if (order.status !== 'Pending' && order.status !== "Shipped") {
            return res.status(404).json({ message: "Only pending and shipped ordres can be cancelled" })
        }

        order.status = "Cancelled";
        await order.save();

        const io = req.app.get("io");
        const onlineUsers = req.app.get("onlineUsers");
        const userId = order.user._id.toString();
        const socketId = onlineUsers[userId];
        if (socketId) {
            io.to(socketId).emit("order-status-updated", {
                orderId: order._id,
                newStatus: order.status,
                message: "Your order has been cancelled.",
            });
        }

        res.json({ message: "Order cancelled successfully", order });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message || "Internal server error" });
    }
};