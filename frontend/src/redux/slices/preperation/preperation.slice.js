import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { API } from "../../../utils/api";

// Initial State
const initialState = {
  preperationMaterial: null,
  status: "idle", // "idle" | "loading" | "succeeded" | "failed"
  error: null,
};

// Async Thunk to fetch preparation material
export const fetchPreperationMaterial = createAsyncThunk(
  "preperation/fetchMaterial",
  async (requirements, thunkAPI) => {
    try {
      const response = await API.post("/personalized-preperation", {
        requirements,
      });
      console.log(response.data)
      return response.data;
    } catch (error) {
      // Return a custom error message for handling
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch preparation material."
      );
    }
  }
);

// Preparation Slice
const preperationSlice = createSlice({
  name: "preperation",
  initialState,
  reducers: {
    resetPreperation: (state) => {
      state.preperationMaterial = null;
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPreperationMaterial.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchPreperationMaterial.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.preperationMaterial = action.payload;
      })
      .addCase(fetchPreperationMaterial.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch data.";
      });
  },
});

// Export actions and reducer
export const { resetPreperation } = preperationSlice.actions;
export default preperationSlice.reducer;
