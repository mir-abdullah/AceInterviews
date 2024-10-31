import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API } from '../../../../utils/api';


// Add a new quiz topic
export const addQuizTopic = createAsyncThunk(
  'quizAdmin/addQuizTopic',
  async (quizTopicData, { rejectWithValue }) => {
    try {
      const response = await API.post('/quizTopic/add', quizTopicData);
      return response.data.newQuizTopic;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Edit a quiz topic
export const editQuizTopic = createAsyncThunk(
  'quizAdmin/editQuizTopic',
  async ({ quizTopicId, updatedData }, { rejectWithValue }) => {
    try {
      const response = await API.patch(`/quizTopic/${quizTopicId}`, updatedData);
      return response.data.updatedQuizTopic;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Delete a quiz topic
export const deleteQuizTopic = createAsyncThunk(
  'quizAdmin/deleteQuizTopic',
  async (quizTopicId, { rejectWithValue }) => {
    try {
      const response = await API.delete(`/quizTopic/${quizTopicId}`);
      return { quizTopicId, message: response.data.message };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Get all quiz topics
export const getAllQuizTopics = createAsyncThunk(
  'quizAdmin/getAllQuizTopics',
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get('/quizTopic');
      return response.data.allQuizTopics;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Get questions by difficulty
export const getQuestionsByDifficulty = createAsyncThunk(
  'quizAdmin/getQuestionsByDifficulty',
  async ({ quizTopicId, difficulty }, { rejectWithValue }) => {
    try {
      const response = await API.get(`/quizTopic/difficulty/${quizTopicId}`, { data: { difficulty } });
      return response.data.questions;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
// Get a specific quiz topic by ID
export const getQuizTopicById = createAsyncThunk(
    'quizAdmin/getQuizTopicById',
    async (quizTopicId, { rejectWithValue }) => {
      try {
        const response = await API.get(`/quizTopic/${quizTopicId}`);
        return response.data.quizTopic;
      } catch (error) {
        return rejectWithValue(error.response.data);
      }
    }
  );
  

// Slice
const quizAdminSlice = createSlice({
  name: 'quizAdmin',
  initialState: {
    quizTopics: [],
    questions: [],
    loading: false,
    error: null,
    message: null,
    currentQuizTopic: null, 
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Add quiz topic
      .addCase(addQuizTopic.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addQuizTopic.fulfilled, (state, action) => {
        state.loading = false;
        state.quizTopics.push(action.payload);
        state.message = 'Quiz Topic added successfully';
      })
      .addCase(addQuizTopic.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Edit quiz topic
      .addCase(editQuizTopic.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editQuizTopic.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.quizTopics.findIndex(topic => topic._id === action.payload._id);
        if (index !== -1) {
          state.quizTopics[index] = action.payload;
        }
        state.message = 'Quiz Topic updated successfully';
      })
      .addCase(editQuizTopic.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete quiz topic
      .addCase(deleteQuizTopic.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteQuizTopic.fulfilled, (state, action) => {
        state.loading = false;
        state.quizTopics = state.quizTopics.filter(topic => topic._id !== action.payload.quizTopicId);
        state.message = action.payload.message;
      })
      .addCase(deleteQuizTopic.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get all quiz topics
      .addCase(getAllQuizTopics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllQuizTopics.fulfilled, (state, action) => {
        state.loading = false;
        state.quizTopics = action.payload;
      })
      .addCase(getAllQuizTopics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get questions by difficulty
      .addCase(getQuestionsByDifficulty.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getQuestionsByDifficulty.fulfilled, (state, action) => {
        state.loading = false;
        state.questions = action.payload;
      })
      .addCase(getQuestionsByDifficulty.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
       // Get a specific quiz topic
       .addCase(getQuizTopicById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getQuizTopicById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentQuizTopic = action.payload; 
      })
      .addCase(getQuizTopicById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default quizAdminSlice.reducer;
