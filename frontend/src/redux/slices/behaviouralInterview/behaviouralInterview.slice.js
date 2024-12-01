import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API } from '../../../utils/api';

// Thunk to fetch all interviews
export const fetchAllInterviews = createAsyncThunk(
  'behaviouralInterview/fetchAllInterviews',
  async (_, { rejectWithValue }) => {
    try {
        console.log('here')
      const response = await API.get('/behaviouralTopic/');
       console.log(response.data)
      return response.data.allInterviews;
    } catch (error) {
        console.log(error)
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Thunk to fetch a specific interview by ID
export const fetchInterview = createAsyncThunk(
  'behaviouralInterview/fetchInterview',
  async (interviewId, { rejectWithValue }) => {
    try {
      const response = await API.get(`/behaviouralTopic/${interviewId}`);
      return response.data.interview;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Thunk to add a click to a specific interview
export const addClick = createAsyncThunk(
  'behaviouralInterview/addClick',
  async (interviewId, { rejectWithValue }) => {
    try {
      const response = await API.post(`/behaviouralTopic/addClick/${interviewId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const behaviouralInterviewSlice = createSlice({
  name: 'behaviouralInterview',
  initialState: {
    allInterviews: [],
    interview: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearInterview(state) {
      state.interview = null; // Resets the interview state
    },
  },
  extraReducers: (builder) => {
    // Handle fetching all interviews
    builder
      .addCase(fetchAllInterviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllInterviews.fulfilled, (state, action) => {
        state.loading = false;
        state.allInterviews = action.payload;
      })
      .addCase(fetchAllInterviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Handle fetching a specific interview
    builder
      .addCase(fetchInterview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInterview.fulfilled, (state, action) => {
        state.loading = false;
        state.interview = action.payload;
      })
      .addCase(fetchInterview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Handle adding a click to a specific interview
    builder
      .addCase(addClick.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addClick.fulfilled, (state, action) => {
        state.loading = false;
        // No need to modify the state here unless you want to reflect the updated click count in the UI
      })
      .addCase(addClick.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearInterview } = behaviouralInterviewSlice.actions;

export default behaviouralInterviewSlice.reducer;
