import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/api.js";

export const getStudentLessons = createAsyncThunk(
    "studentLessons/getAll",
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get("/students/lessons");
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                    "Failed to fetch student lessons"
            );
        }
    }
);

export const getStudentLessonDetails = createAsyncThunk(
    "studentLessons/getDetails",
    async (lessonId, { rejectWithValue }) => {
        try {
            const response = await api.get(
                `/students/lessons/${lessonId}`
            );

            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                    "Failed to fetch lesson details"
            );
        }
    }
);


export const submitSheet = createAsyncThunk(
    "studentLessons/submitSheet",
    async ({ sheetId, answers }, { rejectWithValue }) => {
        try {
            const response = await api.post(
                `/sheets/${sheetId}/submit`,
                { answers }
            );

            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                "Failed to submit sheet"
            );
        }
    }
);


export const submitExam = createAsyncThunk(
    "studentLessons/submitExam",
    async ({ examId, answers }, { rejectWithValue }) => {
        try {
            const response = await api.post(
                `/exams/${examId}/submit`,
                { answers }
            );

            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                "Failed to submit exam"
            );
        }
    }
);

export const updateVideoProgress = createAsyncThunk(
    "studentLessons/updateVideoProgress",
    async ({ videoId, watchedPercentage }, { rejectWithValue }) => {
        try {
            const response = await api.post(
                `/videos/${videoId}/progress`,
                {
                    watched_percentage: watchedPercentage,
                }
            );

            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                "Failed to update video progress"
            );
        }
    }
);

export const sendParentInvitation = createAsyncThunk(
    "studentLessons/sendParentInvitation",
    async ({ inviteContact }, { rejectWithValue }) => {
        try {
            const response = await api.post(
                "/students/parent-invite",
                {
                    invite_contact: inviteContact,
                }
            );

            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                "Failed to send parent invitation"
            );
        }
    }
);

const studentLessonsSlice = createSlice({
    name: "studentLessons",

    initialState: {
        lessons: [],
        selectedLesson: null,
        loading: false,
        detailsLoading: false,
        error: null,
        detailsError: null,

        // Sheet submission
        sheetSubmitting: false,
        sheetSubmitError: null,
        sheetResult: null,

        // Exam submission
        examSubmitting: false,
        examSubmitError: null,
        examResult: null,

        // Video progress
        videoProgressUpdating: false,
        videoProgressError: null,
        videoProgress: null,

        //Parent Invitation
        parentInvitation: null,
        parentInvitationLoading: false,
        parentInvitationError: null,
    },

    reducers: {
        clearSelectedLesson: (state) => {
            state.selectedLesson = null;
            state.detailsError = null;
            state.detailsLoading = false;
        },
    },

    extraReducers: (builder) => {
        builder
            .addCase(getStudentLessons.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getStudentLessons.fulfilled, (state, action) => {
                state.loading = false;
                state.lessons = Array.isArray(action.payload?.lessons)
                    ? action.payload.lessons
                    : [];
            })
            .addCase(getStudentLessons.rejected, (state, action) => {
                state.loading = false;
                state.error =
                    action.payload || "Something went wrong";
            })

            .addCase(getStudentLessonDetails.pending, (state) => {
                state.detailsLoading = true;
                state.detailsError = null;
                state.selectedLesson = null;
            })
            .addCase(getStudentLessonDetails.fulfilled, (state, action) => {
                state.detailsLoading = false;

                state.selectedLesson =
                    action.payload?.lesson ?? action.payload;
            })
            .addCase(getStudentLessonDetails.rejected, (state, action) => {
                state.detailsLoading = false;
                state.detailsError =
                    action.payload || "Failed to fetch lesson details";
            })

            .addCase(submitSheet.pending, (state) => {
                state.sheetSubmitting = true;
                state.sheetSubmitError = null;
                state.sheetResult = null;
            })
            .addCase(submitSheet.fulfilled, (state, action) => {
                state.sheetSubmitting = false;
                state.sheetResult = action.payload;
            })
            .addCase(submitSheet.rejected, (state, action) => {
                state.sheetSubmitting = false;
                state.sheetSubmitError =
                    action.payload || "Failed to submit sheet";
            })


            .addCase(submitExam.pending, (state) => {
                state.examSubmitting = true;
                state.examSubmitError = null;
                state.examResult = null;
            })
            .addCase(submitExam.fulfilled, (state, action) => {
                state.examSubmitting = false;
                state.examResult = action.payload;
            })
            .addCase(submitExam.rejected, (state, action) => {
                state.examSubmitting = false;
                state.examSubmitError =
                    action.payload || "Failed to submit exam";
            })

            .addCase(updateVideoProgress.pending, (state) => {
                state.videoProgressUpdating = true;
                state.videoProgressError = null;
            })
            .addCase(updateVideoProgress.fulfilled, (state, action) => {
                state.videoProgressUpdating = false;
                state.videoProgress = action.payload;
            })
            .addCase(updateVideoProgress.rejected, (state, action) => {
                state.videoProgressUpdating = false;
                state.videoProgressError =
                    action.payload || "Failed to update video progress";
            })

            .addCase(sendParentInvitation.pending, (state) => {
                state.parentInvitationLoading = true;
                state.parentInvitationError = null;
            })

            .addCase(sendParentInvitation.fulfilled, (state, action) => {
                state.parentInvitationLoading = false;
                state.parentInvitation = action.payload;
            })

            .addCase(sendParentInvitation.rejected, (state, action) => {
                state.parentInvitationLoading = false;
                state.parentInvitationError =
                    action.payload || "Failed to send parent invitation";
            });

    },
});

export const { clearSelectedLesson } = studentLessonsSlice.actions;

export default studentLessonsSlice.reducer;