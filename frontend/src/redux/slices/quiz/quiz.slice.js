import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
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
    return response.data; 
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
    console.log({difficulty})

    const response = await API.get(`/quizTopic/${quizTopicId}/difficulty`, 
    {difficulty}
    );
    console.log(response.data)
    return response.data; 
  }
)
// Async thunk for adding a click to a quiz topic
export const addClick = createAsyncThunk(
  'quiz/addClick',
  async (quizTopicId) => {
    const response = await API.post(`/quizTopic/addClick/${quizTopicId}`);
    return response.data; 
  }
);



// Async thunk for evaluating the quiz
export const evaluateQuiz = createAsyncThunk(
    'quiz/evaluateQuiz',
    async ({ quizTopicId, answers ,difficulty }) => {
      const response = await API.post(`/quiz/evaluate/${quizTopicId}`, { answers ,difficulty });
      return response.data; // Return the quiz result data
    }
  );

const quizSlice = createSlice({
    name: 'quiz',
    initialState: {
      topics: [],
      currentTopic: null,
      status: 'idle',
      questions: [], 
      questionsError: null, 
      evaluationStatus: 'idle',
      evaluationResult: null,
      evaluationError: null, 
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
        state.questionsError = null;
      })
      .addCase(getQuestionsByDifficulty.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.questions = action.payload;
      })
      .addCase(getQuestionsByDifficulty.rejected, (state, action) => {
        state.status = 'failed';
        state.questionsError = action.error.message; 
      })

 
      .addCase(evaluateQuiz.pending, (state) => {
        state.evaluationStatus = 'loading';
      })
      .addCase(evaluateQuiz.fulfilled, (state, action) => {
        state.evaluationStatus = 'succeeded';
        state.evaluationResult = action.payload.quizResult; 
      })
      .addCase(evaluateQuiz.rejected, (state, action) => {
        state.evaluationStatus = 'failed';
        state.evaluationError = action.error.message; 
      })

       // Add click to quiz topic
    builder
    .addCase(addClick.pending, (state) => {
      state.status = 'loading';
    })
    .addCase(addClick.fulfilled, (state, action) => {
      state.status = 'succeeded';
      
    })
    .addCase(addClick.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.error.message;
    });
  },
});

export default quizSlice.reducer;
