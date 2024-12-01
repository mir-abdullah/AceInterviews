import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API } from '../../../utils/api';

// Define the base URL for your API
const apiUrl = '/language-test/response';

// Async thunk for creating a response question
export const createResponseQuestion = createAsyncThunk(
  'responseQuestions/create',
  async (questionData, { rejectWithValue }) => {
    try {
      const response = await API.post(apiUrl, questionData);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// Async thunk for getting all response questions
export const getAllResponseQuestions = createAsyncThunk(
  'responseQuestions/getAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get(apiUrl);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// Async thunk for getting a response question by ID
export const getResponseQuestionById = createAsyncThunk(
  'responseQuestions/getById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await API.get(`${apiUrl}/${id}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// Async thunk for updating a response question
export const updateResponseQuestion = createAsyncThunk(
  'responseQuestions/update',
  async ({ id, questionData }, { rejectWithValue }) => {
    try {
      const response = await API.put(`${apiUrl}/${id}`, questionData);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// Async thunk for deleting a response question
export const deleteResponseQuestion = createAsyncThunk(
  'responseQuestions/delete',
  async (id, { rejectWithValue }) => {
    try {
      await API.delete(`${apiUrl}/${id}`);
      return id; // Return the ID to delete from the state
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// Initial state
const initialState = {
  responseQuestions: [],
  loading: false,
  error: null,
};

// Create slice
const responseQuestionsSlice = createSlice({
  name: 'responseQuestions',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Create response question
      .addCase(createResponseQuestion.pending, (state) => {
        state.loading = true;
      })
      .addCase(createResponseQuestion.fulfilled, (state, action) => {
        state.loading = false;
        state.responseQuestions.push(action.payload.question);
      })
      .addCase(createResponseQuestion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.msg || action.error.message;
      })
      
      // Get all response questions
      .addCase(getAllResponseQuestions.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllResponseQuestions.fulfilled, (state, action) => {
        state.loading = false;
        state.responseQuestions = action.payload;
      })
      .addCase(getAllResponseQuestions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.msg || action.error.message;
      })
      
      // Get response question by ID
      .addCase(getResponseQuestionById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getResponseQuestionById.fulfilled, (state, action) => {
        state.loading = false;
        // You can handle fetching single question here, e.g., update a state or modal
      })
      .addCase(getResponseQuestionById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.msg || action.error.message;
      })
      
      // Update response question
      .addCase(updateResponseQuestion.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateResponseQuestion.fulfilled, (state, action) => {
        state.loading = false;
        // Update the modified response question in the responseQuestions array
        const index = state.responseQuestions.findIndex(
          (question) => question._id === action.payload.question._id
        );
        if (index !== -1) {
          state.responseQuestions[index] = action.payload.question;
        }
      })
      .addCase(updateResponseQuestion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.msg || action.error.message;
      })
      
      // Delete response question
      .addCase(deleteResponseQuestion.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteResponseQuestion.fulfilled, (state, action) => {
        state.loading = false;
        state.responseQuestions = state.responseQuestions.filter(
          (question) => question._id !== action.payload
        );
      })
      .addCase(deleteResponseQuestion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.msg || action.error.message;
      });
  },
});

// Export reducer
export default responseQuestionsSlice.reducer;
