import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API } from '../../../utils/api';

// Async thunk for fetching interview topics
export const fetchInterviewTopics = createAsyncThunk(
  'interviewTopics/fetchInterviewTopics',
  async () => {
    const response = await API.get('/technicalInterviewTopic/');
    return response.data;
  }
);

// Async thunk for fetching questions by difficulty
export const fetchQuestionsByDifficulty = createAsyncThunk(
  'interviewTopics/fetchQuestionsByDifficulty',
  async ({ interviewId, difficulty }) => {
    try {
      const response = await API.get(`/technicalInterviewTopic/difficulty/${interviewId}`, {
        params: { difficulty }, 
      });
      return response.data;
    } catch (error) {
      throw error.response.data.message || 'Error fetching questions';
    }
  }
);

// Async thunk for starting an interview
export const startInterview = createAsyncThunk(
  'interviewTopics/startInterview',
  async ({ interviewTopicId, answers, difficulty }, { rejectWithValue }) => {
    try {
      const response = await API.post(`/technicalInterview/start-interview/${interviewTopicId}`, {
        answers,
        difficulty,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error starting the interview');
    }
  }
);

// Async thunk for adding a click
export const addClick = createAsyncThunk(
  'interviewTopics/addClick',
  async (interviewId, { rejectWithValue }) => {
    try {
      const response = await API.post(`/technicalInterviewTopic/addClick/${interviewId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error adding click');
    }
  }
);

const interviewTopicsSlice = createSlice({
  name: 'interviewTopics',
  initialState: {
    topics: [],
    status: 'idle',
    error: null,
    questions: [],
    questionsStatus: 'idle',
    questionsError: null,
    interview: null,
    interviewStatus: 'idle',
    interviewError: null,
    addClickStatus: 'idle', 
    addClickError: null, 
  },
  reducers: {
    resetQuestions: (state) => {
      state.questions = [];
      state.questionsStatus = 'idle';
    },
  },
  extraReducers: (builder) => {
    // Fetch interview topics
    builder
      .addCase(fetchInterviewTopics.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchInterviewTopics.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.topics = action.payload;
      })
      .addCase(fetchInterviewTopics.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });

    // Fetch questions by difficulty
    builder
      .addCase(fetchQuestionsByDifficulty.pending, (state) => {
        state.questionsStatus = 'loading';
      })
      .addCase(fetchQuestionsByDifficulty.fulfilled, (state, action) => {
        state.questionsStatus = 'succeeded';
        state.questions = action.payload.questions;
      })
      .addCase(fetchQuestionsByDifficulty.rejected, (state, action) => {
        state.questionsStatus = 'failed';
        state.questionsError = action.error.message;
      });

    // Start interview
    builder
      .addCase(startInterview.pending, (state) => {
        state.interviewStatus = 'loading';
      })
      .addCase(startInterview.fulfilled, (state, action) => {
        state.interviewStatus = 'succeeded';
        state.interview = action.payload;
      })
      .addCase(startInterview.rejected, (state, action) => {
        state.interviewStatus = 'failed';
        state.interviewError = action.payload;
      });

    // Add click
    builder
      .addCase(addClick.pending, (state) => {
        state.addClickStatus = 'loading';
      })
      .addCase(addClick.fulfilled, (state, action) => {
        state.addClickStatus = 'succeeded';
        state.addClickError = null; 
      })
      .addCase(addClick.rejected, (state, action) => {
        state.addClickStatus = 'failed';
        state.addClickError = action.payload; 
      });
  },
});

export const { resetQuestions } = interviewTopicsSlice.actions;

export default interviewTopicsSlice.reducer;
