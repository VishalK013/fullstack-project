import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/Api";

export const addToWishLIst = createAsyncThunk(
    "wishlist/addToWishList",
    async (productId, { rejectWithValue }) => {
        try {
            await api.post(`wishlist/add`, { productId });
            return productId;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);


export const fetchWishList = createAsyncThunk(
    "wishlist/getWishLIst",
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get(`wishlist/get`);
            return response.wishlist.items;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const fetchAllWishListCount = createAsyncThunk(
    "wishlist/AllWishListCount",
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get(`wishlist/all`);
            return response.count;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const removeWishList = createAsyncThunk(
    "wishlist/removeWishList",
    async (productId, { rejectWithValue }) => {
        try {
            await api.delete(`wishlist/remove/${productId}`);
            return productId;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

const wishlistSlice = createSlice({
    name: "wishlist",
    initialState: {
        items: [],
        loading: false,
        error: null,
        wishlistCount: 0,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Add
            .addCase(addToWishLIst.pending, (state) => {
                state.loading = true;
            })
            .addCase(addToWishLIst.fulfilled, (state, action) => {
                const productId = action.payload;
                const exists = state.items.some(item => item.product === productId);
                console.log(exists);

                if (!exists) {
                    state.items.push({ product: productId });
                    state.wishlistCount += 1;
                }
                state.loading = false;
            })
            .addCase(addToWishLIst.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Fetch
            .addCase(fetchWishList.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchWishList.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchWishList.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Remove
            .addCase(removeWishList.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(removeWishList.fulfilled, (state, action) => {
                const productId = action.payload;
                state.items = state.items.filter(item => {
                    const id = typeof item.product === 'object' ? item.product._id : item.product;
                    return id !== productId;
                });
                state.wishlistCount -= 1;
                state.loading = false;
            })
            .addCase(removeWishList.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Count
            .addCase(fetchAllWishListCount.fulfilled, (state, action) => {
                state.wishlistCount = action.payload;
            });
    }
});

export default wishlistSlice.reducer;
