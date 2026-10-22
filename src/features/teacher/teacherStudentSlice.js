import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import api from "../../api/api.js";

export const getTeacherStudent = createAsyncThunk(
    "teacher",
    async (_ , thunkAPI) => {
        const { rejectWithValue } = thunkAPI;
        try {
            const response = await api.get("/teacher/students")
            return response.data
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Fetch failed"
            );
        }
    }
)

export const unblockStudent = createAsyncThunk(
  "teacherStudent/unblockStudent",
  async (enrollmentId, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;

    try {
      const response = await api.patch(`/teacher/enrollments/${enrollmentId}/unblock`);
      return response.data;
    } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to unblock student");
    }
  }
);


const initialState = {
    error: null,
    loading: false,
    students: [],

    unblockLoading: false,
    unblockError: null,
    unblockSuccess: null,
}
const teacherStudentSlice = createSlice({
    name: "teacherStudentSlice",
    initialState,
    extraReducers : (builder) => {
        builder
            .addCase(getTeacherStudent.pending , (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getTeacherStudent.fulfilled , (state , action)=> {
                state.loading = false;
                state.students = action.payload.students;
            })
            .addCase(getTeacherStudent.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to load students";
            })

            .addCase(unblockStudent.pending, (state) => {
              state.unblockLoading = true;
              state.unblockError = null;
              state.unblockSuccess = null;
            })

            .addCase(unblockStudent.fulfilled, (state, action) => {
              state.unblockLoading = false;
              state.unblockSuccess = action.payload.message;

              const updatedEnrollment = action.payload.enrollment;

              state.students = state.students.map((enrollment) =>
                enrollment.id === updatedEnrollment.id
                  ? { ...enrollment, ...updatedEnrollment }
                  : enrollment
              );
            })

            .addCase(unblockStudent.rejected, (state, action) => {
              state.unblockLoading = false;
              state.unblockError =
                action.payload || "Failed to unblock student";
            });
    }
})
export default teacherStudentSlice.reducer;