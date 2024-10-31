import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API } from '../../../../utils/api';

// Async thunk to fetch all interviews
export const fetchAllInterviews = createAsyncThunk(
  'interviews/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get('/behaviouralTopic/');
      return response.data.allInterviews;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch interviews');
    }
  }
);

// Async thunk to add a new interview topic
export const addInterviewTopic = createAsyncThunk(
  'interviews/addTopic',
  async (interviewData, { rejectWithValue }) => {
    try {
      const response = await API.post('/behaviouralTopic/add', interviewData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to add interview topic');
    }
  }
);

// Async thunk to edit an interview topic
export const editInterviewTopic = createAsyncThunk(
  'interviews/editTopic',
  async ({ interviewId, interviewData }, { rejectWithValue }) => {
    try {
      const response = await API.patch(`/behaviouralTopic/${interviewId}`, interviewData);
      return response.data.updatedInterviewTopic;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to update interview topic');
    }
  }
);

// Async thunk to delete an interview topic
export const deleteInterviewTopic = createAsyncThunk(
  'interviews/deleteTopic',
  async (interviewId, { rejectWithValue }) => {
    try {
      await API.delete(`/behaviouralTopic/${interviewId}`);
      return interviewId;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to delete interview topic');
    }
  }
);

// Async thunk to fetch a specific interview with its questions
export const fetchInterviewWithQuestions = createAsyncThunk(
    'interviews/fetchInterview',
    async (interviewId, { rejectWithValue }) => {
      try {
        const response = await API.get(`/behaviouralTopic/${interviewId}`);
        return response.data.interview;  
      } catch (error) {
        return rejectWithValue(error.response?.data || 'Failed to fetch the interview');
      }
    }
  );
  

const interviewsSlice = createSlice({
  name: 'interviews',
  initialState: {
    interviews: [],
    selectedInterview: null, 
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch interviews
      .addCase(fetchAllInterviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllInterviews.fulfilled, (state, action) => {
        state.loading = false;
        state.interviews = action.payload;
      })
      .addCase(fetchAllInterviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch a specific interview with questions
      .addCase(fetchInterviewWithQuestions.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.selectedInterview = null;
      })
      .addCase(fetchInterviewWithQuestions.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedInterview = action.payload; 
      })
      .addCase(fetchInterviewWithQuestions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add interview topic
      .addCase(addInterviewTopic.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addInterviewTopic.fulfilled, (state, action) => {
        state.loading = false;
        state.interviews.push(action.payload);
      })
      .addCase(addInterviewTopic.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Edit interview topic
      .addCase(editInterviewTopic.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editInterviewTopic.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.interviews.findIndex(
          (topic) => topic._id === action.payload._id
        );
        if (index !== -1) {
          state.interviews[index] = action.payload;
        }
      })
      .addCase(editInterviewTopic.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete interview topic
      .addCase(deleteInterviewTopic.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteInterviewTopic.fulfilled, (state, action) => {
        state.loading = false;
        state.interviews = state.interviews.filter(
          (topic) => topic._id !== action.payload
        );
      })
      .addCase(deleteInterviewTopic.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default interviewsSlice.reducer;
