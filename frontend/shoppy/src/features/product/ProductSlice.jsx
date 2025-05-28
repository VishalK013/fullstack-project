import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchProducts = createAsyncThunk("products/fetch", async (_, { rejectWithValue }) => {
    try {
        const res = await axios.get("http://localhost:5000/api/products");
        return res.data;
    } catch (error) {
        console.error("Error fetching products:", error);
        return rejectWithValue(error.response?.data || "Failed to fetch products");
    }
});

export const addProduct = createAsyncThunk('products/addProducts',
    async (formData, { rejectWithValue }) => {
        try {

            const response = await axios.post("http://localhost:5000/api/products/add", formData, { headers: { 'Content-Type': 'multipart/form-data' } });
            return response.data;

        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
)

const productSlice = createSlice({
    name: "products",
    initialState: {
        products: [],
        product: null,
        loading: false,
        error: null,
        addProductSuccess: false,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchProducts.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.products = action.payload;
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(addProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.addProductSuccess = false;
            })
            .addCase(addProduct.fulfilled, (state, action) => {
                state.loading = false;
                state.product = action.payload;
                state.addProductSuccess = true;
            })
            .addCase(addProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Something went wrong';
                state.addProductSuccess = false;
            });
    }
})

export default productSlice.reducer;