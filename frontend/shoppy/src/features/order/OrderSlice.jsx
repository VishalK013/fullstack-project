import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/Api"

import { clearCart } from "../carts/CartSlice";

export const postOrder = createAsyncThunk(
    "order/postOrder",
    async (orderData, { rejectWithValue, dispatch }) => {
        try {
            const response = await api.post(`/order/place-order`, orderData);
            dispatch(clearCart());

            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const fetchAllOrders = createAsyncThunk(
    "order/fetchAll",
    async (_, { rejectWithValue }) => {
        try {

            const response = await api.get("/order/all");
            return response.orders;

        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
)

export const fetchAllOrderCount = createAsyncThunk(
    'orders/fetchAllOrderCount',
    async (_, { rejectWithValue }) => {
        try {

            const response = await api.get('order/count-all');
            return response.count;

        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const fetchUserOrder = createAsyncThunk(
    "order/fetchUserOrder",
    async (_, { rejectWithValue }) => {
        try {

            const response = await api.get(`order/my`);
            localStorage.setItem("userOrders", JSON.stringify(response.orders));
            return response.orders;

        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
)

export const fetchOrderCount = createAsyncThunk(
    'orders/fetchOrderCount',
    async (_, { rejectWithValue }) => {
        try {

            const response = await api.get('order/count');
            return response.count;

        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);


const orderSlice = createSlice({
    name: "orders",
    initialState: {
        orders: [],
        userOrder: JSON.parse(localStorage.getItem("userOrders")) || [],
        orderCount: 0,
        allOrderCount: 0,
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
            })
            //All orders
            .addCase(fetchAllOrderCount.fulfilled, (state, action) => {
                state.allOrderCount = action.payload;
            })
            //User orders
            .addCase(fetchUserOrder.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserOrder.fulfilled, (state, action) => {
                state.loading = false;
                state.userOrder = action.payload;
            })
            .addCase(fetchUserOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            //Order count
            .addCase(fetchOrderCount.fulfilled, (state, action) => {
                state.orderCount = action.payload;
            });
    }
})

export default orderSlice.reducer;