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

export const cancelBookingThunk = createAsyncThunk(
  "classBooking/cancel",
  async (bookingId, { rejectWithValue }) => {
    try {
      const response = await cancelBooking(bookingId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to cancel booking");
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
      .addCase(fetchMemberBookings.fulfilled, (state, action) => { state.bookings = action.payload; })
      .addCase(cancelBookingThunk.fulfilled, (state, action) => {
        const idx = state.bookings.findIndex((b) => b.id === action.payload.id);
        if (idx !== -1) state.bookings[idx] = action.payload;
      });
  },
});

export default classBookingSlice.reducer;
