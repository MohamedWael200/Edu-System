
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/api.js";

// Get all teacher enrollments for the logged-in student
export const getStudentEnrollments = createAsyncThunk(
    "studentEnrollments/getAll",
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get("/students/enrollments");
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                "Failed to fetch enrollments"
            );
        }
    }
);

// Enroll the student with a teacher
export const enrollWithTeacher = createAsyncThunk(
    "studentEnrollments/enroll",
    async (teacherId, { rejectWithValue }) => {
        try {
            const response = await api.post("/students/enrollments", {
                teacher_id: teacherId,
            });

            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                "Failed to enroll with teacher"
            );
        }
    }
);

const studentEnrollmentSlice = createSlice({
    name: "studentEnrollments",

    initialState: {
        enrollments: [],
        loading: false,
        enrollLoading: false,
        error: null,
        enrollError: null,
    },

    reducers: {
        clearEnrollError: (state) => {
            state.enrollError = null;
        },
    },

    extraReducers: (builder) => {
        builder
            // Fetch enrollments
            .addCase(getStudentEnrollments.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getStudentEnrollments.fulfilled, (state, action) => {
                state.loading = false;

                state.enrollments = action.payload?.enrollments ?? [];
            })
            .addCase(getStudentEnrollments.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Enroll with teacher
            .addCase(enrollWithTeacher.pending, (state) => {
                state.enrollLoading = true;
                state.enrollError = null;
            })
            .addCase(enrollWithTeacher.fulfilled, (state) => {
                state.enrollLoading = false;
            })
            .addCase(enrollWithTeacher.rejected, (state, action) => {
                state.enrollLoading = false;
                state.enrollError = action.payload;
            });
    },
});

export const { clearEnrollError } = studentEnrollmentSlice.actions;

export default studentEnrollmentSlice.reducer;
