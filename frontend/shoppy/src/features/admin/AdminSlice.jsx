import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/Api";

export const getProductSummary = createAsyncThunk(
    "admin/getProductSummary ",
    async (_, { rejectWithValue }) => {
        try {

            const res = await api.get(`admin/products/summary`)
            return res.summary;

        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
)

export const getOrderTrends = createAsyncThunk(
    "admin/getOrderTrends",
    async (_, { rejectWithValue }) => {
        try {

            const res = await api.get(`admin/orders/trends`)
            return res;

        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
)

const adminSlice = createSlice({
    name: "admin",
    initialState: {
        productSummary: [],
        ordersTrends: [],
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getProductSummary.pending, (state) => {
                state.loading = true;
            })
            .addCase(getProductSummary.fulfilled, (state, action) => {
                state.loading = false;
                console.log("action", action.payload)
                state.productSummary = action.payload;
            })
            .addCase(getProductSummary.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            //Order trends
            .addCase(getOrderTrends.pending, (state) => {
                state.loading = true;
            })
            .addCase(getOrderTrends.fulfilled, (state, action) => {
                state.loading = false;
                state.ordersTrends = action.payload;
            })
            .addCase(getOrderTrends.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
})

export default adminSlice.reducer;