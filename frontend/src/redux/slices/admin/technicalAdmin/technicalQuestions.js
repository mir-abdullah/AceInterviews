import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API } from '../../../../utils/api';
// Thunks for asynchronous actions

// Add a new question
export const addQuestion = createAsyncThunk(
  'technicalQuestions/addQuestion',
  async ({ interviewId, text, difficulty }, { rejectWithValue }) => {
    try {
      const response = await API.post(`/technicalQuestion/${interviewId}/add`, { text, difficulty });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Delete a question
export const deleteQuestion = createAsyncThunk(
  'technicalQuestions/deleteQuestion',
  async ({ interviewId, questionId }, { rejectWithValue }) => {
    try {
      const response = await API.delete(`/technicalQuestion/${interviewId}/${questionId}/delete`);
      return { questionId, message: response.data.message };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Update a question
export const updateQuestion = createAsyncThunk(
  'technicalQuestions/updateQuestion',
  async ({ interviewId, questionId, text, difficulty }, { rejectWithValue }) => {
    try {
      const response = await API.patch(`/technicalQuestion/${interviewId}/${questionId}/update`, { text, difficulty });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Slice
const technicalQuestionsSlice = createSlice({
  name: 'technicalQuestions',
  initialState: {
    questions: [],
    loading: false,
    error: null,
    message: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Add question
      .addCase(addQuestion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addQuestion.fulfilled, (state, action) => {
        state.loading = false;
        state.questions.push(action.payload.interviewTopic.questions);
        state.message = action.payload.message;
      })
      .addCase(addQuestion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete question
      .addCase(deleteQuestion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteQuestion.fulfilled, (state, action) => {
        state.loading = false;
        state.questions = state.questions.filter(
          (question) => question._id !== action.payload.questionId
        );
        state.message = action.payload.message;
      })
      .addCase(deleteQuestion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update question
      .addCase(updateQuestion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateQuestion.fulfilled, (state, action) => {
        state.loading = false;
        const updatedQuestion = action.payload.question;
        state.questions = state.questions.map((question) =>
          question._id === updatedQuestion._id ? updatedQuestion : question
        );
        state.message = action.payload.message;
      })
      .addCase(updateQuestion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default technicalQuestionsSlice.reducer;
