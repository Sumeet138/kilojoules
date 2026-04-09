import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getAllFitnessClasses, getTrainerClasses } from "../../API/ApiStore";

export const fetchFitnessClasses = createAsyncThunk(
  "fitnessClass/fetchAll",
  async (type = null, { rejectWithValue }) => {
    try {
      const response = await getAllFitnessClasses(type);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch classes");
    }
  }
);

export const fetchTrainerClasses = createAsyncThunk(
  "fitnessClass/fetchByTrainer",
  async (trainerId, { rejectWithValue }) => {
    try {
      const response = await getTrainerClasses(trainerId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch trainer classes");
    }
  }
);

const fitnessClassSlice = createSlice({
  name: "fitnessClass",
  initialState: { classes: [], trainerClasses: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFitnessClasses.pending, (state) => { state.loading = true; })
      .addCase(fetchFitnessClasses.fulfilled, (state, action) => { state.loading = false; state.classes = action.payload; })
      .addCase(fetchFitnessClasses.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(fetchTrainerClasses.fulfilled, (state, action) => { state.trainerClasses = action.payload; });
  },
});

export default fitnessClassSlice.reducer;
