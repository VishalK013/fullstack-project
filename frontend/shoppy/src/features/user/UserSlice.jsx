import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios"
export const signupUser = createAsyncThunk(
    "user/signupUser",
    async (userdata, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                "http://localhost:5000/api/users/register",
                userdata,
                {
                    headers: { "Content-Type": "application/json" },
                }
            );

            return response.data;
        } catch (err) {
            if (err.response && err.response.data && err.response.data.error) {
                return rejectWithValue(err.response.data.error);
            } else {
                return rejectWithValue("Network error");
            }
        }
    }
);

const userSlice = createSlice({
    name: "user",
    initialState: {
        user: null,
        loading: false,
        error: null,
        success: null
    },
    reducers: {
        clearStatus: (state) => {
            state.error = null;
            state.success = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(signupUser.pending, (state) => {
                state.loading = true,
                    state.error = null,
                    state.success = null
            })
            .addCase(signupUser.fulfilled, (state, action) => {
                state.loading = false,
                    state.user = action.payload.user,
                    state.success = action.payload.message
            })
            .addCase(signupUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
})

export const { clearStatus } = userSlice.actions

export default userSlice.reducer;