import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { API } from "../../../utils/api";

// Fetch user profile action
export const fetchUserProfile = createAsyncThunk(
  'user/fetchProfile', 
  async (_, thunkAPI) => {
    try {
      const response = await API.get('/api/user/profile'); 
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// Confirm old password action
export const confirmOldPassword = createAsyncThunk(
  'user/confirm-old-password',
  async (password, thunkAPI) => {
    try {
      const response = await API.post('/api/user/confirm-old-password', { oldPassword: password }); 
      return response.data; 
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || 'Something went wrong');
    }
  }
);

// Update profile action
export const updateProfile = createAsyncThunk(
  'user/updateProfile',
  async (profileData, thunkAPI) => {
    try {
      const response = await API.put('/api/user/update-profile', profileData);
    //   console.log(profileData)
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// Set new password action
export const changePassword = createAsyncThunk(
  'user/setNewPassword',
  async (newPassword, thunkAPI) => {
    try {
      const response = await API.post('/api/user/reset-password',  newPassword );
      return response.data; 
    } catch (error) {
      
      return thunkAPI.rejectWithValue(error.response?.data || 'Something went wrong');
    }
  }
);

// Delete profile action
export const deleteProfile = createAsyncThunk(
  'user/deleteProfile',
  async (_, thunkAPI) => {
    try {
      const response = await API.delete('/api/user/delete-profile'); 
      return response.data; 
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || 'Something went wrong');
    }
  }
);

export const logoutUser = createAsyncThunk('user/logout', async (_, thunkAPI) => {
  try {
    const response = await API.post('/api/user/logout'); 
    return response.data; 
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || 'Failed to logout');
  }
});


// Send OTP action
export const sendOtp = createAsyncThunk(
  'user/sendOtp',
  async (email, thunkAPI) => {
    try {
      const response = await API.post('/api/user/send-otp', { email });
      return response.data; 
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// Verify OTP action
export const verifyOtp = createAsyncThunk(
  'user/verifyOtp',
  async ({ email, otp }, thunkAPI) => {
    try {
      const response = await API.post('/api/user/verify-otp', { email, otp }); 
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// Forgot Password action
export const forgotPassword = createAsyncThunk(
  'user/forgotPassword',
  async ({ email, newPassword }, thunkAPI) => {
    try {
      const response = await API.post('/api/user/forgot-password', { email, newPassword });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);


const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    status: "idle",
    error: null,
    otpSent: false,
    otpError: null,
    otpVerified: false,
    resetPasswordStatus: "idle",
    resetPasswordError: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch User Profile Reducers
      .addCase(fetchUserProfile.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      
      // Confirm Old Password Reducers
      .addCase(confirmOldPassword.pending, (state) => {
        state.passwordConfirmed = false;
        state.passwordConfirmError = null;
        state.status = "loading";
      })
      .addCase(confirmOldPassword.fulfilled, (state) => {
        state.passwordConfirmed = true; 
        state.status = "succeeded";
      })
      .addCase(confirmOldPassword.rejected, (state, action) => {
        state.passwordConfirmed = false;
        state.passwordConfirmError = action.payload || 'Incorrect Password Entered';
        state.status = "failed";
      })

      // Update Profile Reducers
      .addCase(updateProfile.pending, (state) => {
        state.profileUpdateStatus = "loading";
        state.profileUpdateError = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.profileUpdateStatus = "succeeded";
        state.user = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.profileUpdateStatus = "failed";
        state.profileUpdateError = action.payload; 
      })

        // Set New Password Reducers
        .addCase(changePassword.pending, (state) => {
          state.newPasswordStatus = "loading";
          state.newPasswordError = null;
        })
        .addCase(changePassword.fulfilled, (state) => {
          state.newPasswordStatus = "succeeded";
        })
        .addCase(changePassword.rejected, (state, action) => {
          state.newPasswordStatus = "failed";
          state.newPasswordError = action.payload || 'Failed to set new password';
        })

          // Delete Profile Reducers
      .addCase(deleteProfile.pending, (state) => {
        state.deleteProfileStatus = "loading";
        state.deleteProfileError = null;
      })
      .addCase(deleteProfile.fulfilled, (state) => {
        state.deleteProfileStatus = "succeeded";
        state.user = null; 
      })
      .addCase(deleteProfile.rejected, (state, action) => {
        state.deleteProfileStatus = "failed";
        state.deleteProfileError = action.payload || 'Failed to delete profile';
      })

      //logout reducers

      .addCase(logoutUser.pending, (state) => {
        state.logoutStatus = "loading";
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.logoutStatus = "succeeded";
        state.user = null;
        state.status = "idle"; 
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.logoutStatus = "failed";
        state.logoutError = action.payload || 'Failed to logout';
      })
      builder
      // Send OTP Reducers
      .addCase(sendOtp.pending, (state) => {
        state.status = "loading";
        state.otpSent = false;
        state.otpError = null;
      })
      .addCase(sendOtp.fulfilled, (state) => {
        state.status = "succeeded";
        state.otpSent = true;
        state.otpError=null 
      })
      .addCase(sendOtp.rejected, (state, action) => {
        state.status = "failed";
        state.otpError = action.payload;
      })

      // Verify OTP Reducers
      .addCase(verifyOtp.pending, (state) => {
        state.status = "loading";
        state.otpVerified = false;
      })
      .addCase(verifyOtp.fulfilled, (state) => {
        state.status = "succeeded";
        state.otpVerified = true; 
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.status = "failed";
        state.otpError = action.payload; 
      })

      // Forgot Password Reducers
      .addCase(forgotPassword.pending, (state) => {
        state.resetPasswordStatus = "loading";
        state.resetPasswordError = null;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.resetPasswordStatus = "succeeded";
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.resetPasswordStatus = "failed";
        state.resetPasswordError = action.payload; 
      });
  },
});

export default userSlice.reducer;
