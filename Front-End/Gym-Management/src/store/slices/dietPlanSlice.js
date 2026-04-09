import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getMemberDietPlans, getLatestDietPlan } from "../../API/ApiStore";

export const fetchDietPlans = createAsyncThunk(
  "dietPlan/fetchAll",
  async (memberId, { rejectWithValue }) => {
    try {
      const response = await getMemberDietPlans(memberId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch diet plans");
    }
  }
);

const dietPlanSlice = createSlice({
  name: "dietPlan",
  initialState: { plans: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDietPlans.pending, (state) => { state.loading = true; })
      .addCase(fetchDietPlans.fulfilled, (state, action) => { state.loading = false; state.plans = action.payload; })
      .addCase(fetchDietPlans.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
  },
});

export default dietPlanSlice.reducer;
