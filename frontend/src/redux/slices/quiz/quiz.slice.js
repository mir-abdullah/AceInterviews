import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API } from '../../../utils/api';

// Async thunk for adding a quiz topic
export const addQuizTopic = createAsyncThunk(
  'quiz/addQuizTopic',
  async (quizData) => {
    const response = await API.post('/quizTopic/add', quizData);
    return response.data;
  }
);

// Async thunk for deleting a quiz topic
export const deleteQuizTopic = createAsyncThunk(
  'quiz/deleteQuizTopic',
  async (quizTopicId) => {
    const response = await API.delete(`/quizTopic/${quizTopicId}`);
    return response.data; // Return the quizId for removing from the state
  }
);

// Async thunk for editing a quiz topic
export const editQuizTopic = createAsyncThunk(
  'quiz/editQuizTopic',
  async ({ quizTopicId, updatedData }) => {
    const response = await API.patch(`/quizTopic/${quizTopicId}`, updatedData);
    return response.data;
  }
);

// Async thunk for getting all quiz topics
export const getAllQuizTopics = createAsyncThunk(
  'quiz/getAllQuizTopics',
  async () => {
    const response = await API.get('/quizTopic/');
    return response.data;
  }
);

// Async thunk for getting a specific quiz topic
export const getQuizTopic = createAsyncThunk(
  'quiz/getQuizTopic',
  async (quizTopicId) => {
    const response = await API.get(`/quizTopic/${quizTopicId}`);
    return response.data;
  }
);
// Async thunk for getting questions by difficulty
export const getQuestionsByDifficulty = createAsyncThunk(
  'quiz/getQuestionsByDifficulty',
  async ({ quizTopicId, difficulty }) => {
    const response = await API.get(`/quizTopic/${quizTopicId}/difficulty`, {
     difficulty 
    });
    console.log(response.data.questions)
    return response.data.questions; // Adjust this based on your API response structure
  }
)


// Async thunk for evaluating the quiz
export const evaluateQuiz = createAsyncThunk(
    'quiz/evaluateQuiz',
    async ({ quizTopicId, answers }) => {
      const response = await API.post(`/quiz/evaluate/${quizTopicId}`, { answers });
      return response.data; // Return the quiz result data
    }
  );

const quizSlice = createSlice({
    name: 'quiz',
    initialState: {
      topics: [],
      currentTopic: null,
      status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
      error: null,
      questions: [], // Store questions
      questionsError: null, // Error state for questions
      evaluationStatus: 'idle', // Add state for evaluation
      evaluationResult: null, // Store the result of the evaluation
      evaluationError: null, // Store error for evaluation
    },
  reducers: {},
  extraReducers: (builder) => {
    // Add quiz topic
    builder
      .addCase(addQuizTopic.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addQuizTopic.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.topics.push(action.payload.newQuizTopic);
      })
      .addCase(addQuizTopic.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });

    // Delete quiz topic
    builder
      .addCase(deleteQuizTopic.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteQuizTopic.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.topics = state.topics.filter(topic => topic._id !== action.payload);
      })
      .addCase(deleteQuizTopic.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });

    // Edit quiz topic
    builder
      .addCase(editQuizTopic.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(editQuizTopic.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.topics = state.topics.map(topic =>
          topic._id === action.payload._id ? action.payload : topic
        );
      })
      .addCase(editQuizTopic.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });

    // Get all quiz topics
    builder
      .addCase(getAllQuizTopics.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getAllQuizTopics.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.topics = action.payload;
      })
      .addCase(getAllQuizTopics.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })

    // Get a specific quiz topic
    builder
      .addCase(getQuizTopic.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getQuizTopic.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentTopic = action.payload;
      })
      .addCase(getQuizTopic.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
      builder
      .addCase(getQuestionsByDifficulty.pending, (state) => {
        state.status = 'loading';
        state.questionsError = null; // Reset error on new request
      })
      .addCase(getQuestionsByDifficulty.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.questions = action.payload; // Store questions
      })
      .addCase(getQuestionsByDifficulty.rejected, (state, action) => {
        state.status = 'failed';
        state.questionsError = action.error.message; // Store error message
      })

 
      .addCase(evaluateQuiz.pending, (state) => {
        state.evaluationStatus = 'loading';
      })
      .addCase(evaluateQuiz.fulfilled, (state, action) => {
        state.evaluationStatus = 'succeeded';
        state.evaluationResult = action.payload.quizResult; // Store the evaluation result
      })
      .addCase(evaluateQuiz.rejected, (state, action) => {
        state.evaluationStatus = 'failed';
        state.evaluationError = action.error.message; // Store the error message
      });
  },
});

export default quizSlice.reducer;
