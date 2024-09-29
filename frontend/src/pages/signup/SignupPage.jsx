import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { signupUser, googleLogin } from '../../redux/slices/auth/auth.slice';
import { GoogleLogin } from '@react-oauth/google';
import Modal from '@mui/material/Modal';
import { Box, Typography, Button, CircularProgress, Avatar, Stack } from '@mui/material';
import { motion } from 'framer-motion';
import signup from '../../assets/signup.avif'; // Ensure you have an appropriate signup image

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  borderRadius: 3,
  boxShadow: 24,
  p: 4,
};

export default function SignupPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control the modal

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setError(null);
    const result = await dispatch(signupUser(formData));

    if (signupUser.fulfilled.match(result)) {
      setIsModalOpen(true); // Show modal on success
    } else if (signupUser.rejected.match(result)) {
      if (result.payload && result.payload.msg) {
        setError("This email is already registered. Please use another email.");
      } else {
        setError("An error occurred. Please try again.");
      }
    }
  };

  const handleGoogleSignUp = async (credentialResponse) => {
    try {
      const { credential } = credentialResponse;
      const result = await dispatch(googleLogin(credential));

      if (googleLogin.fulfilled.match(result)) {
        navigate('/dashboard/overview');
      } else if (googleLogin.rejected.match(result)) {
        setError("Google Sign-Up failed. Please try again.");
      }
    } catch (error) { 
      console.error('Google Sign-Up Error:', error);
      setError("An error occurred during Google Sign-Up. Please try again.");
    }
  };

  // Close modal handler
  const closeModal = () => {
    setIsModalOpen(false);
    navigate('/login'); // Redirect to login page after closing the modal
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cyan-100">
      <div className="bg-white shadow-lg rounded-lg flex max-w-4xl mx-auto p-6">
        {/* Left Section (Illustrative Image) */}
        <div className="hidden lg:flex w-1/2 items-center justify-center">
          <img src={signup} alt="Signup Illustration" className="w-full h-auto object-cover rounded-lg" />
        </div>

        {/* Right Section (Form) */}
        <div className="w-full lg:w-1/2 p-8">
          {/* Title */}
          <Typography
            variant="h5"
            gutterBottom
            sx={{ fontWeight: 'bold', textAlign: 'center', color: 'text.primary' }}
          >
            Create Your <span className="text-gradient">AceInterview</span> Account
          </Typography>
          <Typography
            variant="body2"
            sx={{ textAlign: 'center', color: 'text.secondary', mb: 4 }}
          >
            Sign up with your email and password
          </Typography>

          {/* Form */}
          <form className="space-y-6" onSubmit={submitHandler}>
            {/* Name Input */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                required
                placeholder="Enter your name"
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 ${
                  error ? 'border-red-500' : 'border-gray-300'
                }`}
                onChange={handleChange}
              />
            </div>

            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                required
                placeholder="Enter your email"
                pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
                title="Please enter a valid email address"
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 ${
                  error ? 'border-red-500' : 'border-gray-300'
                }`}
                onChange={handleChange}
              />
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                required
                minLength={8}
                placeholder="Enter your password"
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 ${
                  error ? 'border-red-500' : 'border-gray-300'
                }`}
                onChange={handleChange}
              />
            </div>

            {/* Error Message */}
            {error && <Typography className="text-red-500 text-sm text-center">{error}</Typography>}

            {/* Signup Button */}
            <div>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={loading}
                sx={{
                  py: 1.5,
                  fontWeight: 'bold',
                  backgroundColor: 'purple.500',
                  '&:hover': {
                    backgroundColor: 'purple.600',
                  },
                  opacity: loading ? 0.6 : 1,
                  cursor: loading ? 'not-allowed' : 'pointer',
                }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign Up'}
              </Button>
            </div>
          </form>

          {/* Google Sign-Up Section */}
          <div className="text-center mt-6">
            <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
              or
            </Typography>
            <GoogleLogin
              onSuccess={handleGoogleSignUp}
              onError={() => console.log('Google Sign-Up Failed')}
            />
          </div>

          {/* Sign In Link */}
          <div className="text-sm text-center mt-6">
            Already have an account?{' '}
            <Link to="/login">
              <Typography component="span" sx={{ color: 'blue', '&:hover': { textDecoration: 'underline' } }}>
                Login here
              </Typography>
            </Link>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      <Modal
        open={isModalOpen}
        onClose={closeModal}
        aria-labelledby="account-created-title"
        aria-describedby="account-created-description"
        closeAfterTransition
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Box sx={style}>
          <Stack spacing={2} alignItems="center">
            <Avatar sx={{ bgcolor: 'green.500', width: 56, height: 56 }}>
              <Typography variant="h4" color="white">✓</Typography>
            </Avatar>
            <Typography id="account-created-title" variant="h5" component="h2" sx={{ fontWeight: 'bold', textAlign: 'center' }}>
              Account Created Successfully
            </Typography>
            <Typography id="account-created-description" sx={{ mt: 2, textAlign: 'center', color: 'text.secondary' }}>
              An email has been sent to your email address. Please verify it to log in.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={closeModal}
              sx={{
                mt: 3,
                px: 4,
                py: 1.5,
                backgroundColor: 'purple.500',
                '&:hover': {
                  backgroundColor: 'purple.600',
                },
              }}
            >
              Go to Login
            </Button>
          </Stack>
        </Box>
      </Modal>
    </div>
  );
}
