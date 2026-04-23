import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getMemberTransactions, getAllTransactions, recordTransaction, updateTransactionStatus, deleteTransaction } from "../../API/ApiStore";

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

export const recordTransactionThunk = createAsyncThunk(
  "transaction/record",
  async ({ memberId, ...params }, { rejectWithValue }) => {
    try {
      const response = await recordTransaction(memberId, params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to record transaction");
    }
  }
);

export const updateTransactionStatusThunk = createAsyncThunk(
  "transaction/updateStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await updateTransactionStatus(id, status);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to update status");
    }
  }
);

export const deleteTransactionThunk = createAsyncThunk(
  "transaction/delete",
  async (id, { rejectWithValue }) => {
    try {
      await deleteTransaction(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to delete transaction");
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
      .addCase(fetchAllTransactions.fulfilled, (state, action) => { state.transactions = action.payload; })
      .addCase(recordTransactionThunk.fulfilled, (state, action) => { state.transactions.unshift(action.payload); })
      .addCase(updateTransactionStatusThunk.fulfilled, (state, action) => {
        const idx = state.transactions.findIndex((t) => t.id === action.payload.id);
        if (idx !== -1) state.transactions[idx] = action.payload;
      })
      .addCase(deleteTransactionThunk.fulfilled, (state, action) => {
        state.transactions = state.transactions.filter((t) => t.id !== action.payload);
      });
  },
});

export default transactionSlice.reducer;
