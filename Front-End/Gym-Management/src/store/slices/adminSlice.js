import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { loginAdmin } from "../../API/ApiStore";

export const loginAdminThunk = createAsyncThunk(
  "admin/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await loginAdmin(credentials);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Login failed");
    }
  }
);

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    currentAdmin: null,
    loading: false,
    error: null,
  },
  reducers: {
    logoutAdmin: (state) => {
      state.currentAdmin = null;
      localStorage.removeItem("adminId");
      localStorage.removeItem("userRole");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAdminThunk.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(loginAdminThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.currentAdmin = action.payload;
        localStorage.setItem("adminId", action.payload.id);
        localStorage.setItem("adminData", JSON.stringify(action.payload));
        localStorage.setItem("userRole", "admin");
      })
      .addCase(loginAdminThunk.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
  },
});

export const { logoutAdmin } = adminSlice.actions;
export default adminSlice.reducer;
