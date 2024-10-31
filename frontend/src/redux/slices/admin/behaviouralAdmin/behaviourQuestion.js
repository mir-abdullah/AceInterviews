import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { API } from "../../../../utils/api";

// Async thunk to add a new question
export const addQuestion = createAsyncThunk(
  "behaviourQuestions/addQuestion",
  async ({ interviewId, questionData }, { rejectWithValue }) => {
    try {
      const response = await API.post(
        `/behaviouralQuestion/${interviewId}/add`,
        questionData
      );
      return response.data; // Return the response containing the new question
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to add question");
    }
  }
);

// Async thunk to update a question
export const updateQuestion = createAsyncThunk(
  "behaviourQuestions/updateQuestion",
  async ({ interviewId, questionId, questionData }, { rejectWithValue }) => {
    try {
      const response = await API.patch(
        `/behaviouralQuestion/${interviewId}/${questionId}/update`,
        questionData
      );
      return response.data; // Return the updated question
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to update question"
      );
    }
  }
);

// Async thunk to delete a question
export const deleteQuestion = createAsyncThunk(
  "behaviourQuestions/deleteQuestion",
  async ({ interviewId, questionId }, { rejectWithValue }) => {
    try {
      await API.delete(
        `/behaviouralQuestion/${interviewId}/${questionId}/delete`
      );
      return questionId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to delete question"
      );
    }
  }
);

const behaviourQuestionsSlice = createSlice({
  name: "behaviourQuestions",
  initialState: {
    questions: [],
    loading: false,
    error: null,
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
        state.questions.push(action.payload);
      })
      .addCase(addQuestion.rejected, (state, action) => {
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
        const index = state.questions.findIndex(
          (q) => q._id === action.payload._id
        );
        if (index !== -1) {
          state.questions[index] = action.payload;
        }
      })
      .addCase(updateQuestion.rejected, (state, action) => {
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
          (q) => q._id !== action.payload
        );
      })
      .addCase(deleteQuestion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default behaviourQuestionsSlice.reducer;
