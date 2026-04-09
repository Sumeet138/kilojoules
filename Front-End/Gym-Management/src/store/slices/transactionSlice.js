import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getMemberTransactions, getAllTransactions } from "../../API/ApiStore";

export const fetchMemberTransactions = createAsyncThunk(
  "transaction/fetchByMember",
  async (memberId, { rejectWithValue }) => {
    try {
      const response = await getMemberTransactions(memberId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch transactions");
    }
  }
);

export const fetchAllTransactions = createAsyncThunk(
  "transaction/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAllTransactions();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch transactions");
    }
  }
);

const transactionSlice = createSlice({
  name: "transaction",
  initialState: { transactions: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMemberTransactions.pending, (state) => { state.loading = true; })
      .addCase(fetchMemberTransactions.fulfilled, (state, action) => { state.loading = false; state.transactions = action.payload; })
      .addCase(fetchMemberTransactions.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(fetchAllTransactions.fulfilled, (state, action) => { state.transactions = action.payload; });
  },
});

export default transactionSlice.reducer;
