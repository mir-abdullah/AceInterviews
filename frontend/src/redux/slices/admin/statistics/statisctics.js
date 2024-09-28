    // src/redux/slices/statsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { API } from "../../../../utils/api";
// Async thunk to fetch total users
export const fetchTotalUsers = createAsyncThunk("stats/fetchTotalUsers", async () => {
  const response = await API.get("/api/user/count-users");
  console.log(response.data.totalUsers)
  return response.data.totalUsers;
});

// Async thunk to fetch total quizzes
export const fetchTotalQuizzes = createAsyncThunk("stats/fetchTotalQuizzes", async () => {
  const response = await API.get("/quiz/total");
  return response.data.count;
});

// Async thunk to fetch technical interviews count
export const fetchTechnicalInterviews = createAsyncThunk("stats/fetchTechnicalInterviews", async () => {
  const response = await API.get("/technicalInterview/overall-interviews");
  return response.data.count;
});

// Async thunk to fetch behavioral interviews count
export const fetchBehavioralInterviews = createAsyncThunk("stats/fetchBehavioralInterviews", async () => {
  const response = await API.get("/behaviouralInterview/overall");
  return response.data.count;
});

const statsSlice = createSlice({
  name: "stats",
  initialState: {
    totalUsers: 0,
    totalQuizzes: 0,
    technicalInterviews: 0,
    behavioralInterviews: 0,
    loading: false,
    error: null,
  },
  reducers: {
    clearStatsState: (state) => {
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Total users
      .addCase(fetchTotalUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTotalUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.totalUsers = action.payload;
      })
      .addCase(fetchTotalUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Total quizzes
      .addCase(fetchTotalQuizzes.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTotalQuizzes.fulfilled, (state, action) => {
        state.loading = false;
        state.totalQuizzes = action.payload;
      })
      .addCase(fetchTotalQuizzes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Technical interviews
      .addCase(fetchTechnicalInterviews.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTechnicalInterviews.fulfilled, (state, action) => {
        state.loading = false;
        state.technicalInterviews = action.payload;
      })
      .addCase(fetchTechnicalInterviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Behavioral interviews
      .addCase(fetchBehavioralInterviews.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBehavioralInterviews.fulfilled, (state, action) => {
        state.loading = false;
        state.behavioralInterviews = action.payload;
      })
      .addCase(fetchBehavioralInterviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearStatsState } = statsSlice.actions;
export default statsSlice.reducer;
