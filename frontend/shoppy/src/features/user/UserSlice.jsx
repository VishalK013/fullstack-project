import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/Api";

const userFromStorage = JSON.parse(localStorage.getItem("user") || "null");
const tokenFromStorage = localStorage.getItem("token");

export const signupUser = createAsyncThunk(
    "user/signupUser",
    async (userdata, { rejectWithValue }) => {

        try {

            const response = await api.post(`/users/register`, userdata);
            return response;

        } catch (error) {
            const message = error?.response?.data?.message || error?.message || "Login failed. Please try again.";
            return rejectWithValue(message);
        }
    }
);

export const loginUser = createAsyncThunk(
    "user/loginUser",
    async (userdata, { rejectWithValue }) => {

        try {
            const response = await api.post(`/users/login`, userdata);
            localStorage.setItem("expiry", Date.now() + response.expiresIn * 1000);
            return response;

        } catch (error) {
            const message = error?.response?.data?.message || error?.message || "Login failed. Please try again.";
            return rejectWithValue(message);
        }
    }
)

export const fetchUser = createAsyncThunk(
    "user/fetchUsers",
    async (_, { rejectWithValue }) => {
        try {

            const response = await api.get(`/users`);
            return response;

        } catch (error) {
            const message = error?.response?.data?.message || error?.message || "Login failed. Please try again.";
            return rejectWithValue(message);
        }
    }
);

export const fetchUserCount = createAsyncThunk(
    "user/fetchUsersCount",
    async (_, { rejectWithValue }) => {
        try {

            const response = await api.get('users/all');
            return response.count;

        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
)

export const suspendUser = createAsyncThunk(
    "user/suspendedUsers",
    async (userId, { rejectWithValue }) => {
        try {

            const headers = {
                "Content-Type": "multipart/form-data",
            };

            const response = await api.put(`/users/${userId}/suspend`, {}, headers);
            console.log("User data", response)
            return response.user;
        } catch (error) {
            const message = error?.response?.data?.message || error?.message || "Login failed. Please try again.";
            return rejectWithValue(message);
        }
    }
)


export const updateUserProfile = createAsyncThunk(
    "user/updateUserProfile",
    async ({ id, formData }, { rejectWithValue }) => {
        try {
            const headers = {
                "Content-Type": "multipart/form-data",
            };

            const response = await api.put(`/users/update/${id}`, formData, headers);
            console.log("updated user", response);
            return response;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);



const userSlice = createSlice({
    name: "user",
    initialState: {
        user: userFromStorage || null,
        token: tokenFromStorage || null,
        users: [],
        userCount: 0,
        loading: false,
        error: null,
        success: null,
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
        },
        checkTokenExpiration(state) {
            const expiryTime = localStorage.getItem("expiry");

            if (expiryTime && Date.now() > expiryTime) {
                localStorage.removeItem("token");
                localStorage.removeItem("expiry");
                state.user = null;
                state.token = null;
                state.role = null;

                window.location.href = "/login";
            }
        },
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
                state.token = action.payload.token;
                state.success = action.payload.message;

                localStorage.setItem("user", JSON.stringify(action.payload));
                localStorage.setItem("token", action.payload);
            })
            .addCase(signupUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message || "Unknown error";
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
                console.log("Login rejected action:", action);
                state.loading = false;
                state.error = action.payload || action.error.message || "Unknown error";
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
                state.error = action.payload || action.error.message || "Unknown error";
            })
            //FetchALlUsers
            .addCase(fetchUserCount.fulfilled, (state, action) => {
                state.userCount = action.payload
            })
            //suspend user
            .addCase(suspendUser.fulfilled, (state, action) => {
                state.loading = false
                const index = state.users.findIndex(user => user._id === action.payload._id);
                if (index !== -1) {
                    state.users[index] = action.payload;
                }
            })
            .addCase(suspendUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message || "Unknown error";
            })
            //Update user profile
            .addCase(updateUserProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateUserProfile.fulfilled, (state, action) => {
                console.log("action", action.payload)
                state.user = action.payload;
                localStorage.setItem("user", JSON.stringify(state.user)); // persist
            })
            .addCase(updateUserProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
})

export const { clearStatus, logOutUser, checkTokenExpiration } = userSlice.actions

export default userSlice.reducer;