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
        );

        const reviews = await Review.find({ product: productId });

        const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
        const avgRating = reviews.length > 0 ? totalRating / reviews.length : 0;

        await Product.findByIdAndUpdate(productId, {
            rating: Number(avgRating.toFixed(1)),
            numReviews: reviews.length
        });

        res.status(200).json({ message: "Review submitted", review });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong" });
    }
};

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

exports.getReviewsByProductId = async (req, res) => {
    try {
        const { productId } = req.params;
        const reviews = await Review.find({ product: productId })
            .sort({ rating: -1 })
            .populate('user', 'username image')
            .populate('product', 'name')

        res.status(200).json(reviews);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch reviews for this product" });
    }
};

exports.deleteReview = async (req, res) => {
    const reviewId = req.params.id;

    try {
        const review = await Review.findById(reviewId);
        if (!review) {
            return res.status(404).json({ message: "Review not found" });
        }

        await Review.deleteOne({ _id: reviewId });
        res.status(200).json({ message: "Review deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to delete review" });
    }
};

