const Wishlist = require("../model/wishlistModel")

exports.addToWishList = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId } = req.body;

        if (!productId) {
            return res.status(400).json({ message: "Product ID is required" });
        }

        let wishlist = await Wishlist.findOne({ user: userId });

        if (!wishlist) {
            wishlist = new Wishlist({ user: userId, items: [] });
        }

        const exists = wishlist.items.find(
            (item) => item.product.toString() === productId
        );

        if (!exists) {
            wishlist.items.push({ product: productId });
            await wishlist.save();

            return res.status(200).json({
                message: "Added to Wishlist",
                wishlist,
                added: true,
            });
        }

        return res.status(200).json({
            message: "Added to Wishlist",
            items: wishlist.items,  
            added: false,
        });

    } catch (error) {
        console.error("Error adding to wishlist:", error);
        return res.status(500).json({ message: "Server error", details: error.message });
    }
};

exports.getWishlist = async (req, res) => {
    try {

        const userId = req.user.id;

        const wishlist = await Wishlist.findOne({ user: userId }).populate({
            path: "items.product",
            select: "name price rating description image colors"
        })

        if (!wishlist) {
            return res.status(404).json({ message: "Wishlist not found" })
        }

        res.status(200).json({
            success: true,
            wishlist
        })

    } catch (error) {
        console.error("Error fetching wishlist:", error);
        res.status(500).json({ message: "Server error", details: error.message });
    }
}

exports.removeWishList = async (req, res) => {
    try {

        const userId = req.user.id;
        const productId = req.params.id;

        const wishlist = await Wishlist.findOne({ user: userId });

        if (!wishlist) {
            return res.status(404).json({ message: "Wishlist not found " })
        }

        console.log("Items in wishlist before remove:", wishlist.items.map(i => i.product.toString()));
        console.log("Trying to remove:", productId);


        wishlist.items = wishlist.items.filter(item => item.product.toString() !== productId);

        await wishlist.save();

        return res.status(200).json({
            message: "Removed from wishlist",
            items: wishlist.items
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", details: error.message });
    }
};

exports.getAllWishListCount = async (req, res) => {
    try {
        const count = await Wishlist.aggregate([
            { $unwind: "$items" },
            { $count: "totalItems" }
        ]);

        const total = count[0]?.totalItems || 0;

        return res.status(200).json({ count: total });
    } catch (error) {
        console.error("Wishlist count fetch error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

