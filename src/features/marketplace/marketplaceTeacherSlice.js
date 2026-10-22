
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/api.js";


export const getTeachers = createAsyncThunk(
    "marketplace/getTeachers",
    async (filters = {}, thunkAPI) => {
        const { rejectWithValue } = thunkAPI;

        try {
            const response = await api.get("/marketplace/teachers", {
                params: {
                    search: filters.search || undefined,
                    subject: filters.subject || undefined,
                    stage: filters.stage || undefined,
                },
            });

            return response.data.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                "Failed to fetch teachers"
            );
        }
    }
);



export const getTeacherDetails = createAsyncThunk(
    "marketplace/getTeacherDetails",
    async (id, thunkAPI) => {
        const { rejectWithValue } = thunkAPI;

        try {
            const response = await api.get(`/marketplace/teachers/${id}`);

            return response.data.teacher;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                "Failed to get teacher details"
            );
        }
    }
);


const initialState = {
    error: null,
    teachers: [],
    loading: false,

    teacherDetails: null,
    detailsLoading: false,
    detailsError: null,
};

const marketplaceSlice = createSlice({
    name: "marketplace",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getTeachers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getTeachers.fulfilled, (state, action) => {
                state.loading = false;
                state.teachers = action.payload;
            })
            .addCase(getTeachers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to fetch teachers";
            })

            .addCase(getTeacherDetails.pending, (state) => {
                state.detailsLoading = true;
                state.detailsError = null;
                state.teacherDetails = null;
            })
            .addCase(getTeacherDetails.fulfilled, (state, action) => {
                state.detailsLoading = false;
                state.teacherDetails = action.payload;
            })
            .addCase(getTeacherDetails.rejected, (state, action) => {
                state.detailsLoading = false;
                state.detailsError =
                    action.payload || "Failed to get teacher details";
            });
    },
});

export default marketplaceSlice.reducer;
