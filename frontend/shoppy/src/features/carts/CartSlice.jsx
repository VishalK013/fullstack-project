import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api, { isAuthenticated } from "../../api/Api";

export const addToCart = createAsyncThunk(
    "cart/addToCart",
    async ({ productId, quantity, colors }, { getState, rejectWithValue }) => {
        if (isAuthenticated()) {
            try {
                const response = await api.post(`/cart/add`, { productId, quantity ,colors});
                return response;
            } catch (error) {
                return rejectWithValue(
                    error.response?.data?.message || error.message || "Failed to add to cart"
                );
            }
        } else {
            const state = getState().cart;
            const existingItem = state.items.find((item) => item.productId === productId);
            let updatedItems;

            if (existingItem) {
                updatedItems = state.items.map((item) =>
                    item.productId === productId
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            } else {
                updatedItems = [...state.items, { productId, quantity }];
            }

            localStorage.setItem("guest_cart", JSON.stringify(updatedItems));
            return { items: updatedItems };
        }
    }
);

export const getCart = createAsyncThunk(
    "cart/getCart",
    async (_, { rejectWithValue }) => {

        if (isAuthenticated()) {
            try {
                const response = await api.get("/cart/get");
                return response;
            } catch (error) {
                return rejectWithValue(
                    error.response?.data?.message || error.message || "Failed to fetch cart"
                );
            }
        }

        const guestCart = JSON.parse(localStorage.getItem("guest_cart")) || [];


        if (guestCart.length === 0) {
            return { items: [] };
        }

        try {

            const detailedItems = await Promise.all(
                guestCart.map(async (item) => {
                    try {
                        const productResponse = await api.get(`/products/${item.productId}`);
                        const productData = productResponse.data || productResponse;

                        return {
                            ...item,
                            name: productData.name,
                            image: productData.image,
                            price: productData.price,
                            total: productData.price * item.quantity,
                        };
                    } catch (error) {
                        return item;
                    }
                })
            );

            return { items: detailedItems };
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || error.message || "Failed to fetch guest cart product details"
            );
        }
    }
);

export const removeFromCart = createAsyncThunk(
    "cart/removeFromCart",
    async (productId, { getState, rejectWithValue }) => {
        if (isAuthenticated()) {
            try {
                const response = await api.delete(`/cart/remove?productId=${productId}`);

                if (response.success) {
                    return { items: response.items };
                } else {
                    return rejectWithValue(response.message || "Failed to remove from cart");
                }
            } catch (error) {
                return rejectWithValue(
                    error.response?.data?.message || error.message || "Failed to remove from cart"
                );
            }
        } else {
            const state = getState().cart;

            const updatedItems = state.items.filter(item => item.productId !== productId);

            localStorage.setItem("guest_cart", JSON.stringify(updatedItems));
            return { items: updatedItems };
        }
    }
);

const cartSlice = createSlice({
    name: "cart",
    initialState: {
        items: [],
        status: "idle",
        cartQuantity: 0,
        error: null,
        message: null,
    },
    reducers: {
        clearCart: (state) => {
            state.items = [];
            state.cartQuantity = 0;
            state.status = "idle";
            state.error = null;
            localStorage.removeItem("guest_cart");
        },
        incrementGuestQuantity: (state, action) => {
            const productId = action.payload;
            const item = state.items.find(
                (item) => item.product?._id === productId);
            if (item) {
                item.quantity += 1;
            }
            state.cartQuantity = state.items.reduce((total, item) => total + item.quantity, 0);
            localStorage.setItem("guest_cart", JSON.stringify(state.items));
        },

        decrementGuestQuantity: (state, action) => {
            const productId = action.payload;
            const index = state.items.findIndex(
                (item) => item.product?._id === productId);
            if (index !== -1) {
                if (state.items[index].quantity > 1) {
                    state.items[index].quantity -= 1;
                } else {
                    state.items.splice(index, 1);
                }
            }
            state.cartQuantity = state.items.reduce((total, item) => total + item.quantity, 0);
            localStorage.setItem("guest_cart", JSON.stringify(state.items));
        },

    },
    extraReducers: (builder) => {
        builder
            // Add to Cart
            .addCase(addToCart.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(addToCart.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.items = action.payload.items;
                state.cartQuantity = action.payload.items.reduce(
                    (total, item) => total + item.quantity,
                    0
                );
                state.message = "Item added to Cart successfully";
                state.error = null;
            })
            .addCase(addToCart.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload || action.error.message;
                state.message = null;
            })

            // Get Cart
            .addCase(getCart.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(getCart.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.items = action.payload.items || [];
                state.cartQuantity = state.items.reduce(
                    (total, item) => total + item.quantity,
                    0
                );
            })
            .addCase(getCart.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload || action.error.message;
            })

            // Remove from Cart
            .addCase(removeFromCart.pending, (state) => {
                state.status = "loading";
            })
            .addCase(removeFromCart.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.items = action.payload.items;
                state.cartQuantity = state.items.reduce(
                    (total, item) => total + item.quantity,
                    0
                );
            })
            .addCase(removeFromCart.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload || action.error.message;
            });
    },
});

export default cartSlice.reducer;
export const { clearCart, incrementGuestQuantity, decrementGuestQuantity } = cartSlice.actions;
export const selectCartQuantity = (state) => state.cart.cartQuantity;
