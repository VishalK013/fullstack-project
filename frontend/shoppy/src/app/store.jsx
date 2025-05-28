import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../features/user/UserSlice"
import productReducer from "../features/product/ProductSlice"

export const store = configureStore({
    reducer: {
        user: userReducer,
        product:productReducer,
    }
})