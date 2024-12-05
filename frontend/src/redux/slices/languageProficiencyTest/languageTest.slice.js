import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API } from "../../../utils/api";

// Define initial state
const initialState = {
  currentTest: null,
  testResults: [],
  testDetails: null,
  userTestCount: 0,
  totalTestCount: 0,
  status: "idle", // loading, succeeded, failed
  error: null,
};

// Async Thunks

// Start a new test
export const startTest = createAsyncThunk("languageTest/startTest", async (thunkAPI) => {
  try {
    const response = await API.post("/language-proficiency-test/start");
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

// Submit MCQ answers
export const submitMcqAnswers = createAsyncThunk(
  "languageTest/submitMcqAnswers",
  async ({ testId, mcqAnswers }, thunkAPI) => {
    try {
      const response = await API.post("/language-proficiency-test/mcq", { testId, mcqAnswers });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// Submit Response answers
export const submitResponseAnswers = createAsyncThunk(
  "languageTest/submitResponseAnswers",
  async ({ testId, responseAnswers }, thunkAPI) => {
    try {
      const response = await API.post("/language-proficiency-test/response", { testId, responseAnswers });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// Submit Speech answers
export const submitSpeechAnswers = createAsyncThunk(
  "languageTest/submitSpeechAnswers",
  async ({ testId, speechAnswers }, thunkAPI) => {
    try {
      const response = await API.post("/language-proficiency-test/speech", { testId, speechAnswers });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// Get all test results for a user
export const getAllTestResults = createAsyncThunk(
  "languageTest/getAllTestResults",
  async (userId, thunkAPI) => {
    try {
      const response = await API.get("/language-proficiency-test/results", { params: { userId } });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// Get details of a single test
export const getTestDetails = createAsyncThunk("languageTest/getTestDetails", async (testId, thunkAPI) => {
  try {
    const response = await API.get(`/language-proficiency-test/result/${testId}`);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

// Count tests for a user
export const countUserTests = createAsyncThunk("languageTest/countUserTests", async (userId, thunkAPI) => {
  try {
    const response = await API.get("/language-proficiency-test/count", );
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

// Count all tests
export const countAllTests = createAsyncThunk("languageTest/countAllTests", async (_, thunkAPI) => {
  try {
    const response = await API.get("/language-proficiency-test/count/all");
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

// Create the slice
const languageTestSlice = createSlice({
  name: "languageTest",
  initialState,
  reducers: {
    resetCurrentTest(state) {
      state.currentTest = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Start Test
      .addCase(startTest.pending, (state) => {
        state.status = "loading";
      })
      .addCase(startTest.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.currentTest = action.payload;
      })
      .addCase(startTest.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // Handle other thunks similarly (MCQ, Response, Speech, etc.)
      .addCase(submitMcqAnswers.fulfilled, (state, action) => {
        state.currentTest = { ...state.currentTest, mcqResults: action.payload.mcqResults };
      })
      .addCase(submitResponseAnswers.fulfilled, (state, action) => {
        state.currentTest = { ...state.currentTest, responseResults: action.payload.responseResults };
      })
      .addCase(submitSpeechAnswers.fulfilled, (state, action) => {
        state.currentTest = { ...state.currentTest, speechResults: action.payload.speechResults };
      })
      .addCase(getAllTestResults.fulfilled, (state, action) => {
        state.testResults = action.payload;
      })
      .addCase(getTestDetails.fulfilled, (state, action) => {
        state.testDetails = action.payload;
      })
      .addCase(countUserTests.fulfilled, (state, action) => {
        state.userTestCount = action.payload.count;
      })
      .addCase(countAllTests.fulfilled, (state, action) => {
        state.totalTestCount = action.payload.count;
      });
  },
});

// Export actions and reducer
export const { resetCurrentTest } = languageTestSlice.actions;
export default languageTestSlice.reducer;
