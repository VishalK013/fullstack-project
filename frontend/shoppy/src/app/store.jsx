import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../features/user/UserSlice"
import productReducer from "../features/product/ProductSlice"
import cartReducer from "../features/carts/CartSlice"

export const store = configureStore({
    reducer: {
        user: userReducer,
        product: productReducer,
        cart: cartReducer
    }
})
