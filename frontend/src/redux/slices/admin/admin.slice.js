import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API } from '../../../utils/api';

// Thunk for admin login
export const loginAdmin = createAsyncThunk(
  'admin/loginAdmin',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await API.post('/api/admin/login', { email, password });
      return response.data;
    } catch (error) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue('Server error');
      }
    }
  }
);

const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    admin: null,
    loading: false,
    error: null,
  },
  reducers: {
    logoutAdmin: (state) => {
      state.admin = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.admin = action.payload.admin;
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logoutAdmin } = adminSlice.actions;

export default adminSlice.reducer;
