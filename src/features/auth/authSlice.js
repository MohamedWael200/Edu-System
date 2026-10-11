import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import api from "../../api/api.js";
import { storageService } from "../../services/storageService.js";

export const login = createAsyncThunk(
    "auth/login",
    async (credentials , thunkAPI) => {
        const { rejectWithValue } = thunkAPI;
        try {
            const response = await api.post("/auth/login" , credentials)
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Login failed"
            );
        }
    }
)

export const getMe = createAsyncThunk(
    "auth/getMe",
    async ( _ , thunkAPI) => {
        const { rejectWithValue } = thunkAPI;
        try {
            const reponse = await api.get("/auth/me")
            return reponse.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to get user"
            );
        }
    }
)

const initialState = {
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false,
    authLoading: false,
    authInitialized: false,
    error: null,
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.isAuthenticated = true;
            state.error = null;
        },

        markAuthInitialized: (state) => {
            state.authInitialized = true;
        },

        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            state.error = null;
            storageService.removeToken();
        },
    },

    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.isAuthenticated = true;

                storageService.setToken(action.payload.token);
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(getMe.pending, (state) => {
                state.authLoading = true;
                state.authInitialized = false;
                state.error = null;
            })
            .addCase(getMe.fulfilled, (state, action) => {
                state.authLoading = false;
                state.authInitialized = true;
                state.user = action.payload.user;
                state.isAuthenticated = true;
            })
            .addCase(getMe.rejected, (state, action) => {
                state.authLoading = false;
                state.authInitialized = true;
                state.error = action.payload;
                state.isAuthenticated = false;
            })
    },
});

export const {setCredentials, markAuthInitialized , logout} = authSlice.actions;
export default authSlice.reducer;