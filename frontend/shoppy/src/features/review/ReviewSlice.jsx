import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/Api";

export const submitReview = createAsyncThunk(
    "review/submitReview",
    async ({ productId, rating, comment }, { rejectWithValue }) => {
        try {
            const res = await api.post(`/review/post`, { productId, rating, comment })
            return res.review;
        } catch (error) {
            const message = error?.response?.data?.message || error?.message || "Submitting user review failed...";
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
            const message = error?.response?.data?.message || error?.message || "Fetching user review failed";
            return rejectWithValue(message);
        }
    }
)

export const fetchproductByProductid = createAsyncThunk(
    "review/fetchproductByProductid",
    async (productId, { rejectWithValue }) => {
        try {

            const res = await api.get(`review/product/${productId}`)
            return res;

        } catch (error) {
            const message = error?.response?.data?.message || error?.message || "fetching product by id failed";
            return rejectWithValue(message);
        }
    }
)

export const deleteReview = createAsyncThunk(
    "review/deleteReview",
    async (reviewId, { rejectWithValue }) => {
        try {

            const res = await api.delete(`/review/${reviewId}`);
            return { reviewId };

        } catch (error) {
            const message = error?.response?.data?.message || error.message || "Failed to delete review";
            return rejectWithValue(message);
        }
    }
)

const reviewSlice = createSlice({
    name: "review",
    initialState: {
        reviews: [],
        productReviews: [],
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
                console.log("action", action.payload)
                state.reviews = action.payload;
            })
            .addCase(fetchUserReviews.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            //fetchReviewById
            .addCase(fetchproductByProductid.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchproductByProductid.fulfilled, (state, action) => {
                state.loading = false;
                // console.log("object",action.payload)
                state.productReviews = action.payload;
            })
            .addCase(fetchproductByProductid.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            //deletereview
            .addCase(deleteReview.fulfilled, (state, action) => {
                const id = action.payload.reviewId;
                state.reviews = state.reviews.filter(r => r._id !== id);
                state.productReviews = state.productReviews.filter(r => r._id !== id); // <-- Add this line
            })
    }
})

export const { resetReviewStatus } = reviewSlice.actions;
export default reviewSlice.reducer;