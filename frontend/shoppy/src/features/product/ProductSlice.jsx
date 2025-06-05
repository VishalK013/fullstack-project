import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/Api";

export const fetchProducts = createAsyncThunk("products/fetch", async (_, { rejectWithValue }) => {
    try {
        const res = await api.get(`/products`);
        return res;
    } catch (error) {
        return rejectWithValue(error.response?.data || "Failed to fetch products");
    }
});

export const fetchProductById = createAsyncThunk("product/fetchById", async (id, { rejectWithValue }) => {
    try {
        const response = await api.get(`/products/${id}`)
        return response;
    } catch (error) {
        return rejectWithValue(error.response?.data || "Failed to fetch products");
    }
})

export const fetchNewArrivals = createAsyncThunk("newProduct/fetch", async (_, { rejectWithValue }) => {
    try {
        const res = await api.get(`/products/new-arrivals`);
        return res
    } catch (error) {
        return rejectWithValue(error.response?.data || "Failed to fetch new products")
    }
})

export const topSellings = createAsyncThunk("topSellings/fetch", async (_, { rejectWithValue }) => {
    try {
        const res = await api.get(`/products/top-sellings`);
        return res
    } catch (error) {
        return rejectWithValue(error.response?.data || "Failed to fetch top selling product")
    }
})

export const addProduct = createAsyncThunk('products/addProducts',
    async (formData, { rejectWithValue }) => {
        try {

            const response = await api.post(`/products/add`, formData, {});
            return response.data;

        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
)

export const editProduct = createAsyncThunk("product/editProduct", async ({ id, productData }, { rejectWithValue }) => {
    try {

        const formData = new FormData();
        Object.entries(productData).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                formData.append(key, value);
            }
        });


        const response = await api.put(`/products/${id}`, formData, {}
        );

        return response;

    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
})

export const deleteProduct = createAsyncThunk("product/deleteProduct", async (id, { rejectWithValue }) => {
    try {

        const response = await api.delete(`/products/${id}`)
        return response;

    } catch (error) {

        return rejectWithValue(error.response.data)

    }
})


const productSlice = createSlice({
    name: "products",
    initialState: {
        products: [],
        newArrival: [],
        topSelling: [],
        selectedProduct: null,
        loading: false,
        error: null,
        addProductSuccess: false,
    },
    reducers: {

        resetAddProductSuccess: (state) => {
            state.addProductSuccess = false;
        },
    },
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
            .addCase(fetchProductById.pending, (state) => {
                state.loading = true
                state.selectedProduct = null
                state.error = null
            })
            .addCase(fetchProductById.fulfilled, (state, action) => {
                state.loading = false
                state.selectedProduct = action.payload
            })
            .addCase(fetchProductById.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message
            })
            .addCase(fetchNewArrivals.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchNewArrivals.fulfilled, (state, action) => {
                state.loading = false;
                state.newArrival = action.payload;
            })
            .addCase(fetchNewArrivals.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(topSellings.pending, (state) => {
                state.loading = true;
            })
            .addCase(topSellings.fulfilled, (state, action) => {
                state.loading = false;
                state.topSelling = action.payload
            })
            .addCase(topSellings.rejected, (state, action) => {
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
            })
            .addCase(editProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(editProduct.fulfilled, (state, action) => {
                console.log('Updated product payload:', action.payload);
                state.loading = false;
                const index = state.products.findIndex(p => p && p._id === action.payload?._id);
                if (index !== -1) {
                    state.products[index] = action.payload;
                }
            })
            .addCase(editProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to edit product';
            });
    }
})

export const { resetAddProductSuccess, } = productSlice.actions;
export default productSlice.reducer;