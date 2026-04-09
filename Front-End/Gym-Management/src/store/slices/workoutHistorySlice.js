import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getMemberWorkouts, logWorkout, deleteWorkout } from "../../API/ApiStore";

export const fetchWorkouts = createAsyncThunk(
  "workout/fetchAll",
  async (memberId, { rejectWithValue }) => {
    try {
      const response = await getMemberWorkouts(memberId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch workouts");
    }
  }
);

const workoutHistorySlice = createSlice({
  name: "workoutHistory",
  initialState: { workouts: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWorkouts.pending, (state) => { state.loading = true; })
      .addCase(fetchWorkouts.fulfilled, (state, action) => { state.loading = false; state.workouts = action.payload; })
      .addCase(fetchWorkouts.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
  },
});

export default workoutHistorySlice.reducer;
