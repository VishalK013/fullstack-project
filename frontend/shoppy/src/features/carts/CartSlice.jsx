import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/Api"

export const addToCart = createAsyncThunk(
    "cart/addToCart",
    async ({ productId, quantity }, { getState, rejectWithValue }) => {
        try {
            const token = getState().user.token;
            console.log(token)
            const response = await api.post(`/cart/add`, { productId, quantity }, token);
            console.log(response)

            return response;
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

            const response = await api.get("/cart/get", {}, { Authorization: `Bearer ${token}` });
            console.log("Cart API Response:", response);

            return response;

        } catch (error) {
            console.log(error)
            return rejectWithValue(
                error.response?.data?.message || error.message || "Failed to fetch cart"
            );
        }
    }
);

export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async (productId, { rejectWithValue }) => {
    try {
      const data = await api.delete("/cart/remove", { productId });  // data is already response.data
      console.log("Remove from cart response:", data);

      if (data.success) {
        return { items: data.items };
      } else {
        return rejectWithValue(data.message || "Failed to remove from cart");
      }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Failed to remove from cart"
      );
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
        message: null
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
                console.log("Add to cart payload:", action.payload.items);
                state.status = "succeeded";
                state.items = action.payload.items;
                state.cartQuantity = action.payload.items.reduce((total, item) => total + item.quantity, 0);
                state.message = "Item added to Cart successfully"
                state.error = null;
            })
            .addCase(addToCart.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload || action.error.message;
                state.message = null;
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
                console.error("Failed to remove from cart:", state.error);
            })
    },
});

export default cartSlice.reducer;
export const { clearCart } = cartSlice.actions;
export const selectCartQuantity = (state) => state.cart.cartQuantity;
