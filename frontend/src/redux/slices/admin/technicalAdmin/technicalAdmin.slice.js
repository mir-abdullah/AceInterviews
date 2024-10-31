import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { API } from "../../../../utils/api";

// Add a new interview topic
export const addInterviewTopic = createAsyncThunk(
  "technicalInterviews/addInterviewTopic",
  async (topicData, { rejectWithValue }) => {
    try {
      const response = await API.post(
        "/technicalInterviewTopic/add",
        topicData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Get all interview topics
export const getAllInterviewTopics = createAsyncThunk(
  "technicalInterviews/getAllInterviewTopics",
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get("/technicalInterviewTopic");
      return response.data.allInterviews;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Get a specific interview topic by ID
export const getInterviewTopic = createAsyncThunk(
  "technicalInterviews/getInterviewTopic",
  async (interviewId, { rejectWithValue }) => {
    try {
      const response = await API.get(`/technicalInterviewTopic/${interviewId}`);
      console.log(response.data.interview);
      return response.data.interview;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Update an interview topic
export const editInterviewTopic = createAsyncThunk(
  "technicalInterviews/editInterviewTopic",
  async ({ interviewId, updatedData }, { rejectWithValue }) => {
    try {
      const response = await API.patch(
        `/technicalInterviewTopic/${interviewId}`,
        updatedData
      );
      return response.data.updatedInterviewTopic;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Delete an interview topic
export const deleteInterviewTopic = createAsyncThunk(
  "technicalInterviews/deleteInterviewTopic",
  async (interviewId, { rejectWithValue }) => {
    try {
      const response = await API.delete(
        `/technicalInterviewTopic/${interviewId}`
      );
      return interviewId;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Get questions by difficulty
export const getQuestionsByDifficulty = createAsyncThunk(
  "technicalInterviews/getQuestionsByDifficulty",
  async ({ interviewId, difficulty }, { rejectWithValue }) => {
    try {
      const response = await API.get(
        `/technicalInterviewTopic/${interviewId}/difficulty`,
        {
          data: { difficulty },
        }
      );
      return response.data.questions;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Slice
const technicalInterviewsSlice = createSlice({
  name: "technicalInterviews",
  initialState: {
    topics: [],
    currentTopic: null,
    questions: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Add interview topic
      .addCase(addInterviewTopic.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addInterviewTopic.fulfilled, (state, action) => {
        state.loading = false;
        state.topics.push(action.payload.newInterviewTopic);
      })
      .addCase(addInterviewTopic.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get all interview topics
      .addCase(getAllInterviewTopics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllInterviewTopics.fulfilled, (state, action) => {
        state.loading = false;
        state.topics = action.payload;
      })
      .addCase(getAllInterviewTopics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get specific interview topic
      .addCase(getInterviewTopic.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getInterviewTopic.fulfilled, (state, action) => {
        state.loading = false;
        state.currentTopic = action.payload;
      })
      .addCase(getInterviewTopic.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Edit interview topic
      .addCase(editInterviewTopic.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editInterviewTopic.fulfilled, (state, action) => {
        state.loading = false;
        state.currentTopic = action.payload;
        const index = state.topics.findIndex(
          (topic) => topic._id === action.payload._id
        );
        if (index !== -1) {
          state.topics[index] = action.payload;
        }
      })
      .addCase(editInterviewTopic.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete interview topic
      .addCase(deleteInterviewTopic.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteInterviewTopic.fulfilled, (state, action) => {
        state.loading = false;
        state.topics = state.topics.filter(
          (topic) => topic._id !== action.payload
        );
      })
      .addCase(deleteInterviewTopic.rejected, (state, action) => {
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
      });
  },
});

export default technicalInterviewsSlice.reducer;
