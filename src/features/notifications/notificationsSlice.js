
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/api.js";

// 1. Fetch notifications
export const getNotifications = createAsyncThunk(
    "notifications/getNotifications",
    async (_, thunkAPI) => {
        const { rejectWithValue } = thunkAPI;

        try {
            const response = await api.get("/notifications");
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                "Failed to load notifications"
            );
        }
    }
);

// 2. Mark one notification as read
export const markNotificationAsRead = createAsyncThunk(
    "notifications/markNotificationAsRead",
    async (notificationId, thunkAPI) => {
        const { rejectWithValue } = thunkAPI;

        try {
            const response = await api.patch(
                `/notifications/${notificationId}/read`
            );

            return {
                notificationId,
                data: response.data,
            };
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                "Failed to mark notification as read"
            );
        }
    }
);

// 3. Mark all notifications as read
export const markAllNotificationsAsRead = createAsyncThunk(
    "notifications/markAllNotificationsAsRead",
    async (_, thunkAPI) => {
        const { rejectWithValue } = thunkAPI;

        try {
            const response = await api.patch("/notifications/read-all");
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                "Failed to mark all notifications as read"
            );
        }
    }
);

const initialState = {
    notifications: [],
    loading: false,
    error: null,

    markLoadingId: null,
    markError: null,

    markAllLoading: false,
    markAllError: null,
};

const notificationsSlice = createSlice({
    name: "notifications",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch notifications
            .addCase(getNotifications.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getNotifications.fulfilled, (state, action) => {
                state.loading = false;

                state.notifications = Array.isArray(action.payload.data)
                    ? action.payload.data
                    : [];
            })
            .addCase(getNotifications.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to load notifications";
            })

            // Mark one notification as read
            .addCase(markNotificationAsRead.pending, (state, action) => {
                state.markLoadingId = action.meta.arg;
                state.markError = null;
            })
            .addCase(markNotificationAsRead.fulfilled, (state, action) => {
                state.markLoadingId = null;

                const notificationId = action.payload.notificationId;

                state.notifications = state.notifications.map(
                    (notification) =>
                        String(notification.id) === String(notificationId)
                            ? {
                                ...notification,
                                read_at:
                                    action.payload.data.notification?.read_at ??
                                    notification.read_at ??
                                    new Date().toISOString(),
                            }
                            : notification
                );
            })
            .addCase(markNotificationAsRead.rejected, (state, action) => {
                state.markLoadingId = null;
                state.markError =
                    action.payload || "Failed to mark notification as read";
            })

            // Mark all notifications as read
            .addCase(markAllNotificationsAsRead.pending, (state) => {
                state.markAllLoading = true;
                state.markAllError = null;
            })
            .addCase(markAllNotificationsAsRead.fulfilled, (state) => {
                state.markAllLoading = false;

                const now = new Date().toISOString();

                state.notifications = state.notifications.map(
                    (notification) => ({
                        ...notification,
                        read_at: notification.read_at || now,
                    })
                );
            })
            .addCase(markAllNotificationsAsRead.rejected, (state, action) => {
                state.markAllLoading = false;
                state.markAllError =
                    action.payload ||
                    "Failed to mark all notifications as read";
            });
    },
});

export default notificationsSlice.reducer;
