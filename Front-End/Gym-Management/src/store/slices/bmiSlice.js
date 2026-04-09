import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { recordBMI, getMemberBMIHistory } from "../../API/ApiStore";

export const recordBMIThunk = createAsyncThunk(
  "bmi/record",
  async ({ memberId, heightCm, weightKg, notes }, { rejectWithValue }) => {
    try {
      const response = await recordBMI(memberId, heightCm, weightKg, notes);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to record BMI");
    }
  }
);

export const fetchBMIHistory = createAsyncThunk(
  "bmi/fetchHistory",
  async (memberId, { rejectWithValue }) => {
    try {
      const response = await getMemberBMIHistory(memberId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch BMI history");
    }
  }
);

const bmiSlice = createSlice({
  name: "bmi",
  initialState: { records: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(recordBMIThunk.fulfilled, (state, action) => { state.records.unshift(action.payload); })
      .addCase(fetchBMIHistory.pending, (state) => { state.loading = true; })
      .addCase(fetchBMIHistory.fulfilled, (state, action) => { state.loading = false; state.records = action.payload; })
      .addCase(fetchBMIHistory.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
  },
});

export default bmiSlice.reducer;
