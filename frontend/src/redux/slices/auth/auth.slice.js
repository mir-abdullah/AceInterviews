import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API } from '../../../utils/api';

// Thunk for handling the signup process using Axios
export const signupUser = createAsyncThunk(
    'auth/signupUser',
    async (formData, { rejectWithValue }) => {
      try {
        // Send formData directly as the request body
        const response = await API.post('/api/user/signup', formData, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

  
        return response.data; 

      } catch (error) {
        if (error.response && error.response.data) {
          return rejectWithValue(error.response.data);
        }
        return rejectWithValue({ msg: "An error occurred. Please try again." });
      }
    }
  );
  
// Thunk for handling the login process using Axios
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await API.post('/api/user/login', formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log(response.data)

      return response.data;
    } catch (error) {
      console.log(error.response.data)
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data.msg);
      }
      return rejectWithValue(error.message);
    }
  }
);



// Thunk for handling Google login
export const googleLogin = createAsyncThunk(
  'auth/googleLogin',
  async (token, { rejectWithValue }) => {
    try {
      const response = await API.post('/api/user/google-login', { token }, {
        headers: { 'Content-Type': 'application/json' },
      });
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue(error.message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    isLoggedIn: false,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isLoggedIn = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle Signup
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isLoggedIn = true;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || {msg:"Something went Wrong"};
      })

      // Handle Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isLoggedIn = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })


   

      // Handle Google Login
      .addCase(googleLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(googleLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isLoggedIn = true;
      })
      .addCase(googleLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
