const mongoose = require("mongoose")

const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: ["mens", "womens", "kids"],
        required: true
    },
    clothingType: {
        type: String,
        enum: ["tshirt", "shirt", "pant", "jeans", "shorts", "jacket", "hoodies"],
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    rating: {
        type: Number,
        default: 0
    },
    numReviews: {
        type: Number,
        default: 0
    },
    image: {
        type: String,
        required: true
    },
    colors: {
        type: [String],
        required: true,
    },
    sizes: {
        type: [String],
        enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
        required: true
    },
    sold: {
        type: Number,
        default: 0
    },
},
    {
        timestamps: true
    }
)

module.exports = mongoose.model("Product", productSchema)