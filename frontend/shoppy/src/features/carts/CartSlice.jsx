import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseURL } from "../../common/util";

export const addToCart = createAsyncThunk(
    "cart/addToCart",
    async ({ productId, quantity }, { getState, rejectWithValue }) => {
        try {
            const token = getState().user.token;

            const response = await axios.post(
                `${baseURL}/cart/add`,
                { productId, quantity },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    },
                }
            );

            return response.data.items;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || error.message || "Failed to add to cart"
            );
        }
    }
);

export const getCart = createAsyncThunk(
    "cart/getcarts",
    async (_, { getState, rejectWithValue }) => {
        try {
            const token = getState().user.token;

            const response = await axios.get(`${baseURL}/cart/get`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            return response.data;

        } catch (error) {
            console.log(error)
            return rejectWithValue(
                error.response?.data?.message || error.message || "Failed to fetch cart"
            );
        }
    }
);

export const removeFromCart = createAsyncThunk("cart/removeFromCart",
    async (productId, { getState, rejectWithValue }) => {
        try {
            const token = getState().user.token
            console.log(token)

            const response = await axios.delete(`${baseURL}/cart/remove`, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                data: { productId }
            });

            return { items: response.data.items };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to remove from cart")
        }
    }
)


const cartSlice = createSlice({
    name: "cart",
    initialState: {
        items: [],
        status: "idle",
        cartQuantity: 0,
        error: null,
    },
    reducers: {
        clearCart: (state) => {
            state.items = [];
            state.cartQuantity = 0;
            state.status = "idle";
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            //Add to cart
            .addCase(addToCart.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(addToCart.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.items = action.payload;
                state.cartQuantity = action.payload.reduce(
                    (total, item) => total + item.quantity,
                    0
                );
            })
            .addCase(addToCart.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload || action.error.message;
            })
            //Get Cart item
            .addCase(getCart.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(getCart.fulfilled, (state, action) => {
                console.log("Cart data from backend:", action.payload);
                state.status = "succeeded";
                state.items = action.payload.items || [];
                state.cartQuantity = action.payload.items.reduce(
                    (total, item) => total + item.quantity,
                    0
                );
            })
            .addCase(getCart.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload || action.error.message;
            })
            //remove from cart
            .addCase(removeFromCart.pending, (state) => {
                state.status = "loading";
            })
            .addCase(removeFromCart.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.items = action.payload.items;
                state.cartQuantity = action.payload.items.reduce(
                    (total, item) => total + item.quantity,
                    0
                );
            })
            .addCase(removeFromCart.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })
    },
});

export default cartSlice.reducer;
export const { clearCart } = cartSlice.actions;
export const selectCartQuantity = (state) => state.cart.cartQuantity;
