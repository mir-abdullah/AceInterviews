// Import necessary modules
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API } from '../../../utils/api';

// Thunk to fetch all interviews
export const fetchAllInterviews = createAsyncThunk(
  'behaviouralInterview/fetchAllInterviews',
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get('/behaviouralTopic/');
      return response.data.allInterviews;
    } catch (error) {
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
      return rejectWithValue(error.response?.data?.msg || error.message);
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

// Thunk to add a new behavioural interview
export const addBehaviouralInterview = createAsyncThunk(
  'behaviouralInterview/addBehaviouralInterview',
  async ({interviewTopicId,answers}, { rejectWithValue }) => {
    try {
      console.log('idhar')
      const response = await API.post(`/behaviouralInterview/start-interview/${interviewTopicId}`, {answers});
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Slice definition
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
      .addCase(addClick.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(addClick.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Handle adding a new behavioural interview
    builder
      .addCase(addBehaviouralInterview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addBehaviouralInterview.fulfilled, (state, action) => {
        state.loading = false;
        state.allInterviews.push(action.payload); // Append the new interview to the list
      })
      .addCase(addBehaviouralInterview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearInterview } = behaviouralInterviewSlice.actions;

export default behaviouralInterviewSlice.reducer;
