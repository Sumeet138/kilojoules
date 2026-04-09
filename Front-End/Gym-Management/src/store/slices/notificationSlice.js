import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getNotifications, markNotificationRead } from "../../API/ApiStore";

export const fetchNotifications = createAsyncThunk(
  "notification/fetchAll",
  async (role = null, { rejectWithValue }) => {
    try {
      const response = await getNotifications(role);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch notifications");
    }
  }
);

const notificationSlice = createSlice({
  name: "notification",
  initialState: { notifications: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => { state.loading = true; })
      .addCase(fetchNotifications.fulfilled, (state, action) => { state.loading = false; state.notifications = action.payload; })
      .addCase(fetchNotifications.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
  },
});

export default notificationSlice.reducer;
