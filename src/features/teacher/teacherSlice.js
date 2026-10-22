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

export const deleteLesson = createAsyncThunk(
    "teacher/deleteLesson",
    async (id , thunkAPI) => {
        const { rejectWithValue } = thunkAPI;
        try {
            const response = await api.delete(`/teacher/lessons/${id}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Delete lesson failed"
            );
        }
    }
)


export const getLessonDetails = createAsyncThunk(
    "teacher/getLessonDetails",
    async (id, thunkAPI) => {
        const { rejectWithValue } = thunkAPI;

        try {
            const response = await api.get(`/teacher/lessons/${id}`);

            return response.data.lesson;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                "Failed to get lesson details"
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

    deleteLoading: false,
    deleteError: null,
    deletedLesson: null,

    lessonDetails: null,
    detailsLoading: false,
    detailsError: null,
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

                const lesson = action.payload.lesson;

                state.createdLesson = lesson;

                if (
                    lesson &&
                    !state.lessons.some((item) => item.id === lesson.id)
                ) {
                    state.lessons.unshift(lesson);
                }
            })

            .addCase(createLesson.rejected, (state, action) => {
                state.createLoading = false;
                state.createError = action.payload;
            })

            .addCase(deleteLesson.pending, (state) => {
                state.deleteLoading = true;
                state.deleteError = null;
            })

            .addCase(deleteLesson.fulfilled, (state, action) => {
                state.deleteLoading = false;

                const deletedId = action.meta.arg;

                state.lessons = state.lessons.filter(
                    (lesson) => String(lesson.id) !== String(deletedId)
                );

                state.deletedLesson = deletedId;
            })

            .addCase(deleteLesson.rejected, (state, action) => {
                state.deleteLoading = false;
                state.deleteError = action.payload;
            })


            .addCase(getLessonDetails.pending, (state) => {
                state.detailsLoading = true;
                state.detailsError = null;
                state.lessonDetails = null;
            })
            .addCase(getLessonDetails.fulfilled, (state, action) => {
                state.detailsLoading = false;
                state.lessonDetails = action.payload;
            })
            .addCase(getLessonDetails.rejected, (state, action) => {
                state.detailsLoading = false;
                state.detailsError = action.payload;
            })


    }
})

export default teacherSlice.reducer;