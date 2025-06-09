const fs = require('fs');
const path = require('path');
const Product = require("../model/productModel");
const { type } = require('os');

exports.addProduct = async (req, res) => {
    try {
        const { name, price, description, category, clothingType, rating, sold } = req.body;

        if (!name || !price || !description || !category || !rating) {
            return res.status(400).json({ error: "All fields except sold and image are required" });
        }

        if (!req.file) {
            return res.status(400).json({ error: "Product image is required" });
        }

        const priceNumber = Number(price);
        const ratingNumber = Number(rating);
        const soldNumber = sold ? Number(sold) : 0;

        if (isNaN(priceNumber) || priceNumber <= 0) {
            return res.status(400).json({ error: "Price must be a positive number" });
        }

        if (isNaN(ratingNumber) || ratingNumber < 0 || ratingNumber > 5) {
            return res.status(400).json({ error: "Rating must be a number between 0 and 5" });
        }

        if (isNaN(soldNumber) || soldNumber < 0) {
            return res.status(400).json({ error: "Sold must be a non-negative number" });
        }

        const colors = req.body.colors
            ? req.body.colors.split(',').map(c => c.trim()).filter(Boolean)
            : [];
        const sizes = req.body.sizes
            ? req.body.sizes.split(',').map(s => s.trim()).filter(Boolean)
            : [];

        if (sizes.length === 0) {
            return res.status(400).json({ error: "At least one size is required" });
        }

        const imageUrl = `/uploads/${req.file.filename}`;

        const product = new Product({
            name,
            price: priceNumber,
            description,
            category,
            clothingType,
            rating: ratingNumber,
            sold: soldNumber,
            image: imageUrl,
            colors,
            sizes,
        });
        console.log("Parsed colors array:", colors);

        await product.save();

        return res.status(201).json(product);

    } catch (error) {
        console.error("Error while adding product:", error);
        return res.status(500).json({ error: "Failed to add product" });
    }
};

exports.editProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);
        if (!product) return res.status(404).json({ message: "Product not found!" });

        if (req.file) {
            if (product.image) {
                const oldPath = path.join(__dirname, "..", product.image);
                if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
            }
            product.image = `/uploads/${req.file.filename}`;
        }

        const fields = ["name", "price", "description", "category", "clothingType", "rating", "sold"];
        fields.forEach((field) => {
            if (req.body[field] !== undefined) {
                if (field === "sold") {
                    product.sold = Number(req.body.sold);
                } else {
                    product[field] = req.body[field];
                }
            }
        });

        if (req.body.colors !== undefined) {
            product.colors = req.body.colors
                .split(',')
                .map(c => c.trim())
                .filter(Boolean);
        }

        if (req.body.sizes !== undefined) {
            product.sizes = req.body.sizes
                .split(',')
                .map(s => s.trim())
                .filter(Boolean);
        }

        const updated = await product.save();
        res.status(200).json(updated);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};


exports.deleteProduct = async (req, res) => {
    try {

        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        if (product.image) {
            fs.unlinkSync(path.join(__dirname, '..', product.image));
        }

        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Product deleted successfully' });

    } catch (err) {

        res.status(500).json({ message: err.message });

    }
};


exports.getAllProducts = async (req, res) => {
    try {

        const products = await Product.find();
        res.status(200).json(products);

    } catch (error) {

        res.status(500).json({ error: "Failed to fetch products" });

    }
};

exports.getProductById = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" })
        }

        res.json(product);

    } catch (error) {
        res.status(500).json({ message: 'Server error' });

    }
}

exports.getNewArrivals = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 4;
        const skip = (page - 1) * limit;

        const newArrivals = await Product.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        res.json(newArrivals);
    } catch (error) {
        res.status(404).json({ message: "Failed to fetch new arrivals", error: error.message });
    }
};


exports.getTopSellings = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 4;
        const skip = (page - 1) * limit;

        const topSellings = await Product.find()
            .sort({ sold: -1 })
            .skip(skip)
            .limit(limit);

        res.json(topSellings)
    } catch (error) {
        res.status(404).json({ message: "Failed to fetch Top Sellings", error: error.message })
    }
}
