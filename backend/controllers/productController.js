const Product = require("../model/productModel");

const addProduct = async (req, res) => {
    try {
        const { name, price, description, category, rating } = req.body;

        if (!name || !price || !description || !category || !rating || !req.file) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const imageUrl = `/uploads/${req.file.filename}`;

        const product = new Product({
            name,
            price,
            description,
            category,
            rating,
            image: imageUrl,
        });

        await product.save();
        res.status(201).json(product);
    } catch (error) {
        console.error("Error while adding product:", error);
        res.status(500).json({ error: "Failed to add product" });
    }
};

const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch products" });
    }
};

module.exports = { addProduct, getAllProducts}
