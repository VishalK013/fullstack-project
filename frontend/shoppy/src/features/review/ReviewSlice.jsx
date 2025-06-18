import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/Api";

export const submitReview = createAsyncThunk(
    "review/submitReview",
    async ({ productId, rating, comment }, { rejectWithValue }) => {
        try {
            const res = await api.post(`/review`, { productId, rating, comment })
            return res.review;
        } catch (error) {
            const message = error?.response?.data?.message || error?.message || "Login failed. Please try again.";
            return rejectWithValue(message);
        }
    }
)

export const fetchUserReviews = createAsyncThunk(
    "review/fetchUserReviews",
    async (_, { rejectWithValue }) => {
        try {
            const res = await api.get("/review/my-reviews");
            return res;
        } catch (error) {
            const message = error?.response?.data?.message || error?.message || "Login failed. Please try again.";
            return rejectWithValue(message);
        }
    }
)

const reviewSlice = createSlice({
    name: "review",
    initialState: {
        reviews: [],
        loading: false,
        submitting: false,
        error: null,
        submitSuccess: false,
    },
    reducers: {
        resetReviewStatus: (state) => {
            state.submitting = false;
            state.submitSuccess = false;
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(submitReview.pending, (state) => {
                state.submitting = true;
                state.submitSuccess = false;
                state.error = null;
            })
            .addCase(submitReview.fulfilled, (state, action) => {
                state.submitting = false;
                state.submitSuccess = true;
            })
            .addCase(submitReview.rejected, (state, action) => {
                state.submitting = false;
                state.error = action.payload;
            })
            //fetchMyReviews
            .addCase(fetchUserReviews.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserReviews.fulfilled, (state, action) => {
                state.loading = false;
                console.log("action",action.payload)
                state.reviews = action.payload; 
            })
            .addCase(fetchUserReviews.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
})

export const { resetReviewStatus } = reviewSlice.actions;
export default reviewSlice.reducer;