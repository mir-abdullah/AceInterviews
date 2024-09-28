import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { API } from "../../../../utils/api";

// Async thunk to add a question to a quiz topic
export const addQuestion = createAsyncThunk(
  "quizQuestions/addQuestion",
  async ({ quizId, questionText,options,difficulty }, { rejectWithValue }) => {
    // console.log(questionId)
    console.log(options)
    console.log(difficulty)
    try {
      const response = await API.post(`/quiz-questions/${quizId}/add`,{ questionText,options,difficulty});
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk to delete a question from a quiz topic
export const deleteQuestion = createAsyncThunk(
  "quizQuestions/deleteQuestion",
  async ({ quizId, questionId }, { rejectWithValue }) => {
    try {
      const response = await API.delete(`/quiz-questions/${quizId}/${questionId}/delete`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk to update a question in a quiz topic
export const updateQuestion = createAsyncThunk(
  "quizQuestions/updateQuestion",
  async ({ quizId, questionId, questionText,options,difficulty }, { rejectWithValue }) => {
  
    console.log(questionId)
    console.log(options)
    console.log(difficulty)
    try {
      const response = await API.patch(`/quiz-questions/${quizId}/${questionId}/update`, {questionText, difficulty,options});
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const quizQuestionsSlice = createSlice({
  name: "quizQuestions",
  initialState: {
    questions: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    // Handle addQuestion
    builder
      .addCase(addQuestion.pending, (state) => {
        state.loading = true;
      })
      .addCase(addQuestion.fulfilled, (state, action) => {
        state.loading = false;
        state.questions.push(action.payload);
      })
      .addCase(addQuestion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Handle deleteQuestion
    builder
      .addCase(deleteQuestion.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteQuestion.fulfilled, (state, action) => {
        state.loading = false;
        state.questions = state.questions.filter(
          (question) => question._id !== action.meta.arg.questionId
        );
      })
      .addCase(deleteQuestion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Handle updateQuestion
    builder
      .addCase(updateQuestion.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateQuestion.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.questions.findIndex(
          (question) => question._id === action.meta.arg.questionId
        );
        if (index !== -1) {
          state.questions[index] = action.payload.question;
        }
      })
      .addCase(updateQuestion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default quizQuestionsSlice.reducer;
