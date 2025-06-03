const mongoose = require("mongoose")

const CartItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    quantity: {
        type: Number,
        default: 1,
        min: 1
    },
    price: {
        type: Number,
        required: true,
    },
    total: {
        type: Number,
        required: true
    },
     image: {
        type: String,
        required: true
    }
})

const Cartschema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true
    },
    items: [CartItemSchema]
})

const Cart = mongoose.model("Cart", Cartschema)

module.exports = Cart;