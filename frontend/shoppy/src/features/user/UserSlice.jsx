import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios"
import { baseURL } from "../../common/util";

const userFromStorage = JSON.parse(localStorage.getItem("user"));
const tokenFromStorage = localStorage.getItem("token");

export const signupUser = createAsyncThunk(
    "user/signupUser",
    async (userdata, { rejectWithValue }) => {

        try {

            const response = await axios.post(`${baseURL}/api/users/register`, userdata);
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

export const loginUser = createAsyncThunk(
    "user/loginUser",
    async (userdata, { rejectWithValue }) => {

        try {

            const response = await axios.post(`${baseURL}/users/login`, userdata);
            return response.data;

        } catch (err) {

            if (err.response && err.response.data && err.response.data.error) {
                return rejectWithValue(err.response.data.error);
            } else {
                return rejectWithValue("Network error");
            }

        }
    }
)

export const fetchUser = createAsyncThunk(
    "user/fetchUsers",
    async (_, { rejectWithValue }) => {
        try {

            const response = await axios.get(`${baseURL}/users`)

            return response.data;

        } catch (error) {
            if (error.response && error.response.data.error) {
                return rejectWithValue(error.response.data.error);
            } else {
                return rejectWithValue("Network error");
            }
        }
    }
)

const userSlice = createSlice({
    name: "user",
    initialState: {
        user: userFromStorage || null,
        token: tokenFromStorage || null,
        users: [],
        loading: false,
        error: null,
        success: null
    },
    reducers: {
        clearStatus: (state) => {
            state.error = null;
            state.success = null;
        },
        logOutUser: (state) => {
            state.user = null;
            state.token = null;
            state.error = null;
            state.success = null;

            localStorage.removeItem("user");
            localStorage.removeItem("token");
        }
    },
    extraReducers: (builder) => {
        builder
            //Signup handlers !
            .addCase(signupUser.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = null;
            })
            .addCase(signupUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.success = action.payload.message
            })
            .addCase(signupUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Login handlers
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = null
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.success = action.payload.message;

                localStorage.setItem("user", JSON.stringify(action.payload.user));
                localStorage.setItem("token", action.payload.token);
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            //Fetch User
            .addCase(fetchUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUser.fulfilled, (state, action) => {
                state.loading = false;
                state.users = action.payload;
            })
            .addCase(fetchUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
})

export const { clearStatus, logOutUser } = userSlice.actions

export default userSlice.reducer;