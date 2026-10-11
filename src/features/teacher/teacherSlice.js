import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import api from "../../api/api.js";

export const getLessons = createAsyncThunk(
    'teacher/getLessons',
    async (_ , thunkAPI) => {
        const { rejectWithValue } = thunkAPI;
        try {
            const response = await api.get("/teacher/lessons")
            return  response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Fetch failed"
            );
        }
    }
)

export const createLesson = createAsyncThunk(
    "teacher/createLesson",
    async (lessonData, thunkAPI) => {
        const { rejectWithValue } = thunkAPI;

        try {
            const response = await api.post(
                "/teacher/lessons",
                lessonData
            );

            console.log(response.data);

            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Create lesson failed"
            );
        }
    }
);

const initialState = {
    error: null,
    lessons: [],
    loading: false,

    createLoading: false,
    createError: null,
    createdLesson: null,
}
const teacherSlice = createSlice({
    name: "teacher",
    initialState ,
    extraReducers : (builder) => {
        builder
            .addCase(getLessons.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getLessons.fulfilled, (state, action) => {
                state.loading = false;
                state.lessons = action.payload.lessons;
            })
            .addCase(getLessons.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(createLesson.pending , (state) => {
                state.createLoading = true;
                state.createError = null;
            })
            .addCase(createLesson.fulfilled, (state, action) => {
                state.createLoading = false;
                state.createdLesson = action.payload.lesson;
            })
            .addCase(createLesson.rejected, (state, action) => {
                state.createLoading = false;
                state.createError = action.payload;
            })
    }
})

export default teacherSlice.reducer;