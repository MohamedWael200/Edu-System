
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/api.js";

// 1. جلب طلبات ربط ولي الأمر بالطلاب
export const getLinkRequests = createAsyncThunk(
    "parent/getLinkRequests",
    async (_, thunkAPI) => {
        const { rejectWithValue } = thunkAPI;

        try {
            const response = await api.get("/parents/link-requests");

            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                "Failed to fetch link requests"
            );
        }
    }
);

// 2. قبول طلب ربط طالب بولي الأمر
export const approveLinkRequest = createAsyncThunk(
    "parent/approveLinkRequest",
    async (requestId, thunkAPI) => {
        const { rejectWithValue } = thunkAPI;

        try {
            const response = await api.post(
                `/parents/link-requests/${requestId}/approve`
            );

            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                "Failed to approve link request"
            );
        }
    }
);


export const getChildOverview = createAsyncThunk(
    "parent/getChildOverview",
    async (studentId, thunkAPI) => {
        const { rejectWithValue } = thunkAPI;

        try {
            const response = await api.get(
                `/parents/${studentId}/overview`
            );

            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                "Failed to fetch student overview"
            );
        }
    }
);


export const getLinkedStudents = createAsyncThunk(
    "parent/getLinkedStudents",
    async (_, thunkAPI) => {
        const { rejectWithValue } = thunkAPI;

        try {
            const response = await api.get("/parents/linked-students");

            return response.data.students;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                "Failed to fetch linked students"
            );
        }
    }
);


export const downloadMonthlyReport = createAsyncThunk(
    "parent/downloadMonthlyReport",
    async ({ studentId, month, year }, thunkAPI) => {
        try {
            const response = await api.get(
                `/parents/${studentId}/reports/${month}`,
                {
                    params: { year },
                    responseType: "blob",
                }
            );

            const disposition =
                response.headers["content-disposition"] || "";

            const match = disposition.match(
                /filename\*?=(?:UTF-8''|")?([^";\n]+)/i
            );

            const filename = match
                ? decodeURIComponent(match[1].replace(/"/g, "").trim())
                : `student_report_${studentId}_${year}_${month}.pdf`;

            return {
                blob: response.data,
                filename,
            };
        } catch (error) {
            let message = "Failed to download the monthly report.";

            // Error responses may also arrive as a Blob.
            if (error.response?.data instanceof Blob) {
                try {
                    const text = await error.response.data.text();
                    const data = JSON.parse(text);
                    message = data.message || message;
                } catch {
                    if (error.response.status === 404) {
                        message = "No report found for this month.";
                    } else if (error.response.status === 403) {
                        message = "You are not allowed to access this report.";
                    }
                }
            } else {
                message =
                    error.response?.data?.message ||
                    error.message ||
                    message;
            }

            return thunkAPI.rejectWithValue(message);
        }
    }
);


const initialState = {
    linkRequests: null,
    loading: false,
    error: null,

    approveLoading: false,
    approveError: null,
    approveSuccess: false,

    childOverview: null,
    overviewLoading: false,
    overviewError: null,

    linkedStudents: [],
    studentsLoading: false,
    studentsError: null,

    reportLoading: false,
    reportError: null,
};

const parentSlice = createSlice({
    name: "parent",
    initialState,

    reducers: {
        resetApproveStatus: (state) => {
            state.approveSuccess = false;
            state.approveError = null;
        },
    },

    extraReducers: (builder) => {
        builder
            // Get link requests
            .addCase(getLinkRequests.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getLinkRequests.fulfilled, (state, action) => {
                state.loading = false;
                state.linkRequests = action.payload;
            })
            .addCase(getLinkRequests.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Approve link request
            .addCase(approveLinkRequest.pending, (state) => {
                state.approveLoading = true;
                state.approveError = null;
                state.approveSuccess = false;
            })
            .addCase(approveLinkRequest.fulfilled, (state) => {
                state.approveLoading = false;
                state.approveSuccess = true;
            })
            .addCase(approveLinkRequest.rejected, (state, action) => {
                state.approveLoading = false;
                state.approveError = action.payload;
            })


            .addCase(getChildOverview.pending, (state) => {
                state.overviewLoading = true;
                state.overviewError = null;
            })
            .addCase(getChildOverview.fulfilled, (state, action) => {
                state.overviewLoading = false;
                state.childOverview = action.payload;
            })
            .addCase(getChildOverview.rejected, (state, action) => {
                state.overviewLoading = false;
                state.overviewError = action.payload;
            })


            .addCase(getLinkedStudents.pending, (state) => {
                state.studentsLoading = true;
                state.studentsError = null;
            })
            .addCase(getLinkedStudents.fulfilled, (state, action) => {
                state.studentsLoading = false;
                state.linkedStudents = action.payload;
            })
            .addCase(getLinkedStudents.rejected, (state, action) => {
                state.studentsLoading = false;
                state.studentsError = action.payload;
            })


            .addCase(downloadMonthlyReport.pending, (state) => {
                state.reportLoading = true;
                state.reportError = null;
            })
            .addCase(downloadMonthlyReport.fulfilled, (state) => {
                state.reportLoading = false;
            })
            .addCase(downloadMonthlyReport.rejected, (state, action) => {
                state.reportLoading = false;
                state.reportError =
                    action.payload || "Failed to download the monthly report.";
            });
    },
});

export const { resetApproveStatus } = parentSlice.actions;

export default parentSlice.reducer;
