import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API } from '../../../utils/api';
// Async thunks for fetching data

// Fetch behavioral interview results
export const fetchBehavioralInterviewResults = createAsyncThunk(
  'results/fetchBehavioralInterviewResults',
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get('/behaviouralInterview/results');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Fetch count of behavioral interviews
export const fetchBehavioralInterviewCount = createAsyncThunk(
  'results/fetchBehavioralInterviewCount',
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get('/behavioralInterview/count');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Fetch technical interview results
export const fetchTechnicalInterviewResults = createAsyncThunk(
  'results/fetchTechnicalInterviewResults',
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get('/technicalInterview/results');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Fetch count of technical interviews
export const fetchTechnicalInterviewCount = createAsyncThunk(
  'results/fetchTechnicalInterviewCount',
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get('/technicalInterview/count');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Fetch quiz results
export const fetchQuizResults = createAsyncThunk(
  'results/fetchQuizResults',
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get('/quiz/results');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Fetch count of quizzes
export const fetchQuizCount = createAsyncThunk(
  'results/fetchQuizCount',
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get('/quiz/count');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Initial state
const initialState = {
  behavioralInterviews: [],
  behavioralInterviewCount: 0,
  technicalInterviews: [],
  technicalInterviewCount: 0,
  quizzes: [],
  quizCount: 0,
  loading: false,
  error: null,
};

// Slice
const resultsSlice = createSlice({
  name: 'results',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Behavioral interview results
      .addCase(fetchBehavioralInterviewResults.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBehavioralInterviewResults.fulfilled, (state, action) => {
        state.loading = false;
        state.behavioralInterviews = action.payload;
      })
      .addCase(fetchBehavioralInterviewResults.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Behavioral interview count
      .addCase(fetchBehavioralInterviewCount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBehavioralInterviewCount.fulfilled, (state, action) => {
        state.loading = false;
        state.behavioralInterviewCount = action.payload.count;
      })
      .addCase(fetchBehavioralInterviewCount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Technical interview results
      .addCase(fetchTechnicalInterviewResults.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTechnicalInterviewResults.fulfilled, (state, action) => {
        state.loading = false;
        state.technicalInterviews = action.payload;
      })
      .addCase(fetchTechnicalInterviewResults.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Technical interview count
      .addCase(fetchTechnicalInterviewCount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTechnicalInterviewCount.fulfilled, (state, action) => {
        state.loading = false;
        state.technicalInterviewCount = action.payload.count;
      })
      .addCase(fetchTechnicalInterviewCount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Quiz results
      .addCase(fetchQuizResults.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQuizResults.fulfilled, (state, action) => {
        state.loading = false;
        state.quizzes = action.payload;
      })
      .addCase(fetchQuizResults.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Quiz count
      .addCase(fetchQuizCount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQuizCount.fulfilled, (state, action) => {
        state.loading = false;
        state.quizCount = action.payload.count;
      })
      .addCase(fetchQuizCount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export actions and reducer
export default resultsSlice.reducer;
