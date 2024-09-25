import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API } from '../../../utils/api';

// Async Thunks
export const submitFeedback = createAsyncThunk(
  'feedback/submitFeedback',
  async (feedbackData, { rejectWithValue }) => {
    try {
      const response = await API.post('/feedback/submit', feedbackData);
      return response.data.feedbacks;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getAllFeedback = createAsyncThunk(
  'feedback/getAllFeedback',
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get('/feedback/all');
      return response.data.feedbacks;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getRatingsCount = createAsyncThunk(
  'feedback/getRatingsCount',
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get('/feedback/ratings');
      return response.data.ratingsCount;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Slice
const feedbackSlice = createSlice({
  name: 'feedback',
  initialState: {
    feedbacks: [],
    ratingsCount: [],
    loading: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    clearFeedbackState: (state) => {
      state.error = null;
      state.successMessage = null;
    }
  },
  extraReducers: (builder) => {
    // Submit Feedback
    builder
      .addCase(submitFeedback.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitFeedback.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message;
      })
      .addCase(submitFeedback.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      });

    // Get All Feedback
    builder
      .addCase(getAllFeedback.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllFeedback.fulfilled, (state, action) => {
        state.loading = false;
        state.feedbacks = action.payload;
      })
      .addCase(getAllFeedback.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      });

    // Get Ratings Count
    builder
      .addCase(getRatingsCount.pending, (state) => {
        state.loading = true;
      })
      .addCase(getRatingsCount.fulfilled, (state, action) => {
        state.loading = false;
        state.ratingsCount = action.payload;
      })
      .addCase(getRatingsCount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      });
  }
});

export const { clearFeedbackState } = feedbackSlice.actions;
export default feedbackSlice.reducer;
