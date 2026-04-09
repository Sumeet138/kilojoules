import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { loginTrainer, getTrainerById, getAllTrainers } from "../../API/ApiStore";

export const loginTrainerThunk = createAsyncThunk(
  "trainer/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await loginTrainer(credentials);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Login failed");
    }
  }
);

export const fetchAllTrainers = createAsyncThunk(
  "trainer/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAllTrainers();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch trainers");
    }
  }
);

const trainerSlice = createSlice({
  name: "trainer",
  initialState: {
    currentTrainer: null,
    trainers: [],
    loading: false,
    error: null,
  },
  reducers: {
    logoutTrainer: (state) => {
      state.currentTrainer = null;
      localStorage.removeItem("trainerId");
      localStorage.removeItem("userRole");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginTrainerThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginTrainerThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.currentTrainer = action.payload;
        localStorage.setItem("trainerId", action.payload.id);
        localStorage.setItem("trainerData", JSON.stringify(action.payload));
        localStorage.setItem("userRole", "trainer");
      })
      .addCase(loginTrainerThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchAllTrainers.fulfilled, (state, action) => {
        state.trainers = action.payload;
      });
  },
});

export const { logoutTrainer } = trainerSlice.actions;
export default trainerSlice.reducer;
