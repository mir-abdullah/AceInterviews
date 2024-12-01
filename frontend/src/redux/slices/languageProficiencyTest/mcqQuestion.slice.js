import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API } from '../../../utils/api';

const API_URL = '/language-test/mcq'; // Adjust the API URL to match your backend routes

// Thunks for async operations
export const fetchMcqQuestions = createAsyncThunk('mcq/fetchQuestions', async (_, { rejectWithValue }) => {
  try {
    const response = await API.get(API_URL);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const addMcqQuestion = createAsyncThunk('mcq/addQuestion', async (question, { rejectWithValue }) => {
  try {
    const response = await API.post(`${API_URL}/add`, question);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const updateMcqQuestion = createAsyncThunk(
  'mcq/updateQuestion',
  async ({ id, updatedQuestion }, { rejectWithValue }) => {
    try {
      const response = await API.put(`${API_URL}/update/${id}`, updatedQuestion);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteMcqQuestion = createAsyncThunk('mcq/deleteQuestion', async (id, { rejectWithValue }) => {
  try {
    const response = await API.delete(`${API_URL}/delete/${id}`);
    return id; // Return the deleted question's ID
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

// Slice
const mcqSlice = createSlice({
  name: 'mcq',
  initialState: {
    questions: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch MCQ questions
      .addCase(fetchMcqQuestions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMcqQuestions.fulfilled, (state, action) => {
        state.loading = false;
        state.questions = action.payload;
      })
      .addCase(fetchMcqQuestions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add MCQ question
      .addCase(addMcqQuestion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addMcqQuestion.fulfilled, (state, action) => {
        state.loading = false;
        state.questions.push(action.payload);
      })
      .addCase(addMcqQuestion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update MCQ question
      .addCase(updateMcqQuestion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMcqQuestion.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.questions.findIndex((q) => q._id === action.payload._id);
        if (index !== -1) {
          state.questions[index] = action.payload;
        }
      })
      .addCase(updateMcqQuestion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete MCQ question
      .addCase(deleteMcqQuestion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteMcqQuestion.fulfilled, (state, action) => {
        state.loading = false;
        state.questions = state.questions.filter((q) => q._id !== action.payload);
      })
      .addCase(deleteMcqQuestion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Actions and reducer export
export const { clearError } = mcqSlice.actions;
export default mcqSlice.reducer;
