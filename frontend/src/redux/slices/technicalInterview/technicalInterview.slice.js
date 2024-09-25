import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
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
        difficulty,
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
      // Use rejectWithValue to return error details
      return rejectWithValue(error.response?.data?.message || 'Error starting the interview');
    }
  }
);

const interviewTopicsSlice = createSlice({
  name: 'interviewTopics',
  initialState: {
    topics: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
    questions: [], // Add state for questions
    questionsStatus: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    questionsError: null, // Error state for questions
    interview: null, // Store the interview result
    interviewStatus: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    interviewError: null, // Error state for starting the interview
  },
  reducers: {
    resetQuestions: (state) => {
      state.questions = [];  // Reset the questions array
      state.questionsStatus = 'idle';  // Reset the status
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
        state.questions = action.payload.questions; // Assuming the API returns an object with a 'questions' array
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
        state.interview = action.payload; // Store the interview result
      })
      .addCase(startInterview.rejected, (state, action) => {
        state.interviewStatus = 'failed';
        state.interviewError = action.payload; // Use rejectWithValue for detailed error
      });
  },
});
export const { resetQuestions } = interviewTopicsSlice.actions;

export default interviewTopicsSlice.reducer;
