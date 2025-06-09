const Cart = require("../model/cartModel");
const Product = require("../model/productModel");

exports.addToCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId, quantity ,colors} = req.body;

        if (!productId || typeof quantity !== 'number' || quantity === 0) {
            return res.status(400).json({ message: "Product ID and a non-zero quantity are required" });
        }

        const productDoc = await Product.findById(productId);
        if (!productDoc) return res.status(404).json({ message: "Product not found." });

        const price = productDoc.price;
        const itemTotal = price * quantity;
        const image = productDoc.image;

        let cart = await Cart.findOne({ user: userId });

        if (!cart) {
            cart = new Cart({
                user: userId,
                items: [{
                    product: productId,
                    quantity,
                    price,
                    total: itemTotal,
                    colors,
                    image
                }]
            });
        } else {
            const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);

            if (itemIndex > -1) {
                cart.items[itemIndex].quantity += quantity;

                if (cart.items[itemIndex].quantity <= 0) {
                    cart.items.splice(itemIndex, 1);
                } else {
                    cart.items[itemIndex].total = cart.items[itemIndex].quantity * cart.items[itemIndex].price;
                }

                cart.items[itemIndex].image = image;
            } else {
                cart.items.push({
                    product: productId,
                    quantity,
                    price,
                    total: itemTotal,
                    colors,
                    image
                });
            }
        }

        await cart.save();
        await cart.populate('items.product');

        res.status(200).json({ items: cart.items });

    } catch (error) {
        console.error('Add to cart error:', error);
        res.status(500).json({ message: error.message || "Internal server error" });
    }
};
exports.getCart = async (req, res) => {
    try {
        const userId = req.user.id;

        const cart = await Cart.findOne({ user: userId });
        if (!cart) {
            return res.json({ items: [] });
        }

        await cart.populate('items.product');

        const itemsWithImages = cart.items.map(item => ({
            _id: item._id,
            product: item.product._id,
            name: item.product.name,
            price: item.price,
            quantity: item.quantity,
            total: item.total,
            colors:item.colors,
            image: item.product.image,
        }));

        res.json({ items: itemsWithImages });
    } catch (error) {
        console.error("Error fetching cart:", error);
        res.status(500).json({ message: "Failed to fetch cart" });
    }
}
exports.removeFromCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId } = req.query;
        console.log("Received productId from query:", productId);

        if (!productId) {
            return res.status(400).json({ message: "Product ID is required to remove item." });
        }

        const cart = await Cart.findOne({ user: userId });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found." });
        }

        const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);

        if (itemIndex === -1) {
            return res.status(404).json({ message: "Product not found in cart." });
        }

        cart.items.splice(itemIndex, 1);

        await cart.save();
        await cart.populate('items.product');

        const itemsWithImages = cart.items.map(item => ({
            _id: item._id,
            product: item.product._id,
            name: item.product.name,
            price: item.price,
            quantity: item.quantity,
            total: item.total,
            colors:items.colors,
            image: item.product.image,
        }));

        res.status(200).json({ success: true, items: itemsWithImages });
    } catch (error) {
        console.error('Remove from cart error:', error);
        res.status(500).json({ message: "Failed to remove item from cart" });
    }
};


