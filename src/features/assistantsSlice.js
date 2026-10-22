import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import api from "../api/api.js";


export const getAssistants = createAsyncThunk(
    "assistants",
    async (_ , thunkAPI) => {
        const { rejectWithValue } = thunkAPI;
        try {
            const response = await api.get("/teacher/assistants")
            return response.data
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Fetch failed"
            );
        }
    }
)

export const createAssistant = createAsyncThunk(
    "assistant/create",
    async (assistantData, thunkAPI) => {
        const { rejectWithValue } = thunkAPI;

        try {
            const response = await api.post(
                "/teacher/assistants",
                assistantData
            );

            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                "Creation failed"
            );
        }
    }
);



const initialState = {
    error: null,
    loading: false,
    assistants: [],

    createError: null,
    createLoading: false,
    createSuccess: null,
};

const assistantsSlice = createSlice({
    name: "assistantsSlice",
    initialState,
    extraReducers : (builder) => {
        builder
            .addCase(getAssistants.pending , (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAssistants.fulfilled , (state , action)=> {
                state.loading = false;
                state.assistants = action.payload.assistants;
            })
            .addCase(getAssistants.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to load assistants";
            })

            .addCase(createAssistant.pending, (state) => {
                state.createLoading = true;
                state.createError = null;
                state.createSuccess = null;
            })

            .addCase(createAssistant.fulfilled, (state, action) => {
                state.createLoading = false;
                state.createSuccess =
                    action.payload.message || "Assistant created successfully";
            })

            .addCase(createAssistant.rejected, (state, action) => {
                state.createLoading = false;
                state.createError =
                    action.payload || "Failed to create assistant";
            });
    }
})
export default assistantsSlice.reducer;