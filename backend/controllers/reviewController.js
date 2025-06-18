const Review = require('../model/reviewModel')
const Product = require("../model/productModel")

exports.createOrUpdateReview = async (req, res) => {
    const { rating, comment, productId } = req.body;
    const userId = req.user.id;

    try {

        const review = await Review.findOneAndUpdate(
            { user: userId, product: productId },
            { rating, comment },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        )

        const reviews = await Review.find({ product: productId });

        const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

        await Product.findByIdAndUpdate(productId, {
            rating: avgRating.toFixed(1),
            numReviews: reviews.length
        });

        res.status(200).json({ message: "Review submitted", review });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong" });
    }
}
exports.getProductReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ product: req.params.productId }).populate('user', 'name');
        res.status(200).json(reviews);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch reviews" });
    }
};

exports.getMyReviews = async (req, res) => {
    const userId = req.user.id;
    const reviews = await Review.find({ user: userId }).select('product');
    res.json(reviews);
};

exports.getAllReviews = async (req, res) => {
    try {
        const reviews = await Review.find()
            .populate('user', 'name')
            .populate('product', 'name');
        res.status(200).json(reviews);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch all reviews" });
    }
};