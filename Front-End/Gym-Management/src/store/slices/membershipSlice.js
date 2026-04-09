import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { subscribeToPlan, getMemberMemberships, getActiveMembership, getAllActivePlans } from "../../API/ApiStore";

export const fetchActivePlans = createAsyncThunk(
  "membership/fetchPlans",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAllActivePlans();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch plans");
    }
  }
);

export const fetchMemberMemberships = createAsyncThunk(
  "membership/fetchByMember",
  async (memberId, { rejectWithValue }) => {
    try {
      const response = await getMemberMemberships(memberId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch memberships");
    }
  }
);

export const subscribeThunk = createAsyncThunk(
  "membership/subscribe",
  async ({ memberId, planId }, { rejectWithValue }) => {
    try {
      const response = await subscribeToPlan(memberId, planId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to subscribe");
    }
  }
);

const membershipSlice = createSlice({
  name: "membership",
  initialState: { plans: [], memberships: [], activeMembership: null, loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchActivePlans.fulfilled, (state, action) => { state.plans = action.payload; })
      .addCase(fetchMemberMemberships.fulfilled, (state, action) => { state.memberships = action.payload; })
      .addCase(subscribeThunk.fulfilled, (state, action) => { state.memberships.push(action.payload); state.activeMembership = action.payload; })
      .addCase(subscribeThunk.rejected, (state, action) => { state.error = action.payload; });
  },
});

export default membershipSlice.reducer;
