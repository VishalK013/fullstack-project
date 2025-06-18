import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../features/user/UserSlice"
import productReducer from "../features/product/ProductSlice"
import cartReducer from "../features/carts/CartSlice"
import orderReducer from "../features/order/OrderSlice"
import wishlistReducer from "../features/wishlist/WishListSlice"
import adminReducer from "../features/admin/AdminSlice"
import revieReducer from "../features/review/ReviewSlice"

export const store = configureStore({
    reducer: {
        user: userReducer,
        product: productReducer,
        wishlist: wishlistReducer,
        cart: cartReducer,
        orders: orderReducer,
        admin: adminReducer,
        review: revieReducer
    }
})
