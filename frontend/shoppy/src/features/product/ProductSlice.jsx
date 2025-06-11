import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/Api";

export const fetchProducts = createAsyncThunk(
    "products/fetch",
    async (filters = {}, { getState, rejectWithValue }) => {
        try {
            const state = getState().product;

            const params = new URLSearchParams();

            // Filters
            if (filters.minPrice !== undefined && filters.maxPrice !== undefined) {
                params.append("minPrice", filters.minPrice);
                params.append("maxPrice", filters.maxPrice);
            }

            if (filters.colors?.length) {
                params.append("colors", filters.colors.join(",").toLowerCase());
            }

            if (filters.sizes?.length) {
                params.append("sizes", filters.sizes.join(",").toUpperCase());
            }

            if (filters.clothingType?.length) {
                params.append("clothingType", filters.clothingType.join(",").toLowerCase());
            }

            const skip = filters.skip ?? state.skip ?? 0;
            const limit = filters.limit ?? state.limit ?? 6;

            params.append("skip", skip);
            params.append("limit", limit);

            const response = await api.get(`/products?${params.toString()}`);

            return {
                products: response.products,
                total: response.total,
                skip,
                limit,
                isLoadMore: filters.skip !== undefined,
            };
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to fetch products");
        }
    }
);

export const fetchProductById = createAsyncThunk("product/fetchById", async (id, { rejectWithValue }) => {
    try {
        const response = await api.get(`/products/${id}`)
        return response;
    } catch (error) {
        return rejectWithValue(error.response?.data || "Failed to fetch products");
    }
})

export const fetchNewArrivals = createAsyncThunk(
    'product/fetchNewArrivals',
    async ({ page, limit }, { rejectWithValue }) => {
        try {
            const response = await api.get(`/products/new-arrivals?page=${page}&limit=${limit}`);
            return response;
        } catch (error) {
            return rejectWithValue(error?.response?.data || { message: error.message });
        }
    }
);

export const fetchClothingTypes = createAsyncThunk("products/fetchClothingTypes", async (_, { rejectWithValue }) => {
    try {
        const response = await api.get(`products/clothing-types`);
        return response.clothingType;
    } catch (error) {
        return rejectWithValue(error.response.data)
    }
});

export const fetchColors = createAsyncThunk("products/fetchColors", async (_, { rejectWithValue }) => {
    try {
        const response = await api.get(`products/colors`);
        return response.colors;
    } catch (error) {
        return rejectWithValue(error.response.data)
    }
})


export const topSellings = createAsyncThunk(
    "topSellings/fetch",
    async ({ page = 1, limit = 4 }, { rejectWithValue }) => {
        try {
            const res = await api.get(`/products/top-sellings?page=${page}&limit=${limit}`);
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
        clothingType: [],
        colors: [],
        selectedProduct: null,
        loading: false,
        error: null,
        addProductSuccess: false,
        page: 1,
        totalPages: 1,
        limit: 6,
        skip: 0,
        initialFetchDone: false,
    },
    reducers: {
        updateLimit: (state, action) => {
            state.limit = action.payload; // Update limit properly
        },
        resetAddProductSuccess: (state) => {
            state.addProductSuccess = false;
        },
        resetProductState: (state) => {
            state.products = [];
            state.skip = 0;
            state.loading = false;
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProducts.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.total = action.payload.total;

                // Initial fetch (skip = 0)
                if (state.skip === 0 && !state.initialFetchDone) {
                    state.products = action.payload.products;
                    state.initialFetchDone = true;
                } else {
                    // Avoid duplicate products on scroll
                    const newProductIds = new Set(state.products.map((p) => p._id));
                    const newProducts = action.payload.products.filter(
                        (p) => !newProductIds.has(p._id)
                    );
                    state.products.push(...newProducts);
                }

                state.skip += action.payload.products.length;
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
                const newItems = action.payload || [];

                if (state.page === 1) {
                    state.newArrival = newItems;
                } else {
                    state.newArrival = [...state.newArrival, ...newItems];
                }
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
                const newItems = action.payload || [];

                if (state.page === 1) {
                    state.topSelling = newItems;
                } else {
                    state.topSelling = [...state.topSelling, ...newItems];
                }
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
                state.loading = false;
                const index = state.products.findIndex(p => p && p._id === action.payload?._id);
                if (index !== -1) {
                    state.products[index] = action.payload;
                }
            })
            .addCase(editProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to edit product';
            })
            .addCase(fetchClothingTypes.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchClothingTypes.fulfilled, (state, action) => {
                state.loading = false;
                state.clothingType = action.payload;
            })
            .addCase(fetchClothingTypes.rejected, (state, action) => {
                state.loading = false;
                state.colors = action.error.message;
            }).addCase(fetchColors.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchColors.fulfilled, (state, action) => {
                state.loading = false;
                state.colors = action.payload;
            })
            .addCase(fetchColors.rejected, (state, action) => {
                state.loading = false;
                state.colors = action.error.message;
            });
    }
})

export const { resetAddProductSuccess, resetProductState } = productSlice.actions;
export default productSlice.reducer;