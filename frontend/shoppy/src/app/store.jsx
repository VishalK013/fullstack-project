import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../features/user/UserSlice"
import productReducer from "../features/product/ProductSlice"

export const store = configureStore({
    reducer: {
        user: userReducer,
        product: productReducer,
    }
})

store.subscribe(() => {
    const state = store.getState();
    localStorage.setItem('cartItems', JSON.stringify(state.product.cartItems));
})