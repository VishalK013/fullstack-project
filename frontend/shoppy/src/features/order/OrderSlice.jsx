import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/Api"

import { clearCart } from "../carts/CartSlice";

export const postOrder = createAsyncThunk(
    "order/postOrder",
    async (orderData, { getState, rejectWithValue, dispatch }) => {
        try {
            const token = getState().user.token;
            const response = await api.post(`/order/place-order`, orderData , token);
            dispatch(clearCart());

            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const fetchAllOrders = createAsyncThunk(
    "order/fetchAll",
    async (_, { getState, rejectWithValue }) => {
        try {

            const token = getState().user.token;
            const response = await api.get("/order/all", {}, { Authorization: `Bearer ${token}` });
            return response.orders;

        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
)


const orderSlice = createSlice({
    name: "orders",
    initialState: {
        orders: [],
        loading: false,
        error: null,
        orderConfirmation: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = action.payload;
            })
            .addCase(fetchAllOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(postOrder.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.orderConfirmation = null;
            })
            .addCase(postOrder.fulfilled, (state, action) => {
                state.loading = false;
                state.orderConfirmation = action.payload;
            })
            .addCase(postOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
})

export default orderSlice.reducer;