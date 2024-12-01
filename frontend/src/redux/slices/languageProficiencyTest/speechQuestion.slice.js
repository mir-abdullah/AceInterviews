import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API } from '../../../utils/api';
import { alignProperty } from '@mui/material/styles/cssUtils';

// Define the initial state for the speech questions
const initialState = {
  speechQuestions: [],
  loading: false,
  error: null,
};

// Asynchronous thunk to fetch all speech questions
export const fetchSpeechQuestions = createAsyncThunk(
  'speechQuestions/fetchAll',
  async () => {
    const response = await API.get('/language-test/speech'); 
    console.log(response.data)
    return response.data;
  }
);

// Asynchronous thunk to create a new speech question
export const createSpeechQuestion = createAsyncThunk(
  'speechQuestions/create',
  async (newQuestion) => {
    const response = await API.post('/language-test/speech', newQuestion);
    return response.data;
  }
);

// Asynchronous thunk to update a speech question
export const updateSpeechQuestion = createAsyncThunk(
  'speechQuestions/update',
  async ({ id, updatedQuestion }) => {
    const response = await API.put(`/language-test/speech/${id}`, updatedQuestion);
    return response.data;
  }
);

// Asynchronous thunk to delete a speech question
export const deleteSpeechQuestion = createAsyncThunk(
  'speechQuestions/delete',
  async (id) => {
    await API.delete(`/language-test/speech/${id}`);
    return id; // Return the id to remove the question from the state
  }
);

// Create the speechQuestions slice
const speechQuestionsSlice = createSlice({
  name: 'speechQuestions',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch all speech questions
      .addCase(fetchSpeechQuestions.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSpeechQuestions.fulfilled, (state, action) => {
        state.loading = false;
        state.speechQuestions = action.payload;
      })
      .addCase(fetchSpeechQuestions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Create a new speech question
      .addCase(createSpeechQuestion.pending, (state) => {
        state.loading = true;
      })
      .addCase(createSpeechQuestion.fulfilled, (state, action) => {
        state.loading = false;
        state.speechQuestions.push(action.payload);
      })
      .addCase(createSpeechQuestion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Update a speech question
      .addCase(updateSpeechQuestion.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateSpeechQuestion.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.speechQuestions.findIndex(
          (question) => question._id === action.payload._id
        );
        if (index !== -1) {
          state.speechQuestions[index] = action.payload;
        }
      })
      .addCase(updateSpeechQuestion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Delete a speech question
      .addCase(deleteSpeechQuestion.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteSpeechQuestion.fulfilled, (state, action) => {
        state.loading = false;
        state.speechQuestions = state.speechQuestions.filter(
          (question) => question._id !== action.payload
        );
      })
      .addCase(deleteSpeechQuestion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default speechQuestionsSlice.reducer;

