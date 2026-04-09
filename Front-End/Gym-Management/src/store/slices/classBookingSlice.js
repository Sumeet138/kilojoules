import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { bookClass, getMemberBookings, cancelBooking } from "../../API/ApiStore";

export const bookClassThunk = createAsyncThunk(
  "classBooking/book",
  async ({ memberId, classId }, { rejectWithValue }) => {
    try {
      const response = await bookClass(memberId, classId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Booking failed");
    }
  }
);

export const fetchMemberBookings = createAsyncThunk(
  "classBooking/fetchByMember",
  async (memberId, { rejectWithValue }) => {
    try {
      const response = await getMemberBookings(memberId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch bookings");
    }
  }
);

const classBookingSlice = createSlice({
  name: "classBooking",
  initialState: { bookings: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(bookClassThunk.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(bookClassThunk.fulfilled, (state, action) => { state.loading = false; state.bookings.push(action.payload); })
      .addCase(bookClassThunk.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(fetchMemberBookings.fulfilled, (state, action) => { state.bookings = action.payload; });
  },
});

export default classBookingSlice.reducer;
