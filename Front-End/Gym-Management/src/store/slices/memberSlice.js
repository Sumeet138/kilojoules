import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { loginMember, registerMember, getMemberById } from "../../API/ApiStore";

export const loginMemberThunk = createAsyncThunk(
  "member/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await loginMember(credentials);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Login failed");
    }
  }
);

export const fetchMemberById = createAsyncThunk(
  "member/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await getMemberById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch member");
    }
  }
);

const memberSlice = createSlice({
  name: "member",
  initialState: {
    currentMember: null,
    loading: false,
    error: null,
  },
  reducers: {
    logoutMember: (state) => {
      state.currentMember = null;
      localStorage.removeItem("memberId");
      localStorage.removeItem("userRole");
    },
    setMember: (state, action) => {
      state.currentMember = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginMemberThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginMemberThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.currentMember = action.payload;
        localStorage.setItem("memberId", action.payload.id);
        localStorage.setItem("memberData", JSON.stringify(action.payload));
        localStorage.setItem("userRole", "member");
      })
      .addCase(loginMemberThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchMemberById.fulfilled, (state, action) => {
        state.currentMember = action.payload;
      });
  },
});

export const { logoutMember, setMember } = memberSlice.actions;
export default memberSlice.reducer;
