import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, googleLogin } from '../../redux/slices/auth/auth.slice';
import { useNavigate, Link } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import Cookies from 'js-cookie';
import { GoogleLogin } from '@react-oauth/google';
import ForgotPasswordModal from '../../components/modals/ForgotPasswordModal';
import login from '../../assets/login.avif'

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showError, setShowError] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);
  const [isForgotPasswordModalOpen, setForgotPasswordModalOpen] = useState(false);
 

  const openForgotPasswordModal = () => {
    setForgotPasswordModalOpen(true);
  };

  const closeForgotPasswordModal = () => {
    setForgotPasswordModalOpen(false);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowError(false);
    setError(null);

    try {
      const result = await dispatch(loginUser(formData));

      if (loginUser.fulfilled.match(result)) {
        const token = result.payload.token;
        Cookies.set('token', token, { expires: 1 });
        navigate('/dashboard/overview');
      } else if (loginUser.rejected.match(result)) {
        const errorMessage = result.payload || "Invalid Email or Password Entered";
        setError(errorMessage);
        setShowError(true);
        setFormData((prev) => ({ ...prev, password: '' }));
        setTimeout(() => setShowError(false), 3000);
      }
    } catch (error) {
      setError("An unexpected error occurred");
      setShowError(true);
    }
  };

  const handleGoogleLogin = async (credentialResponse) => {
    try {
      const { credential } = credentialResponse;
      const result = await dispatch(googleLogin(credential));

      if (googleLogin.fulfilled.match(result)) {
        const token = result.payload.token;
        Cookies.set('token', token, { expires: 1 });
        navigate('/dashboard/overview');
      } else if (googleLogin.rejected.match(result)) {
        setError("Google Login failed. Please try again.");
      }
    } catch (error) {
      console.error('Google Login Error:', error);
      setError("An error occurred during Google Login. Please try again.");
    }
  };
//bg-gradient-to-r from-purple-300 via-blue-200 to-green-300
  return (
    <div className="min-h-screen flex items-center justify-center bg-cyan-100">
      <div className="bg-white shadow-lg rounded-lg flex max-w-4xl mx-auto p-6">
        {/* Left Section (Optional) */}
        <div className="hidden lg:flex w-1/2 items-center justify-center">
          <img src={login} alt="Login Illustration" className="w-full h-auto" />
        </div>

        {/* Right Section (Form) */}
        <div className="w-full lg:w-1/2 p-8">
          {/* Title */}
          <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">Welcome back to <span className="text-gradient">AceInterview</span></h2>
          <div className="text-sm font-normal mb-4 text-center text-gray-700">
            Log in to your account
          </div>

          {/* Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="text"
                id="email"
                value={formData.email}
                className={`w-full px-4 py-3 rounded-lg border ${showError ? 'border-red-500' : 'border-gray-300'} shadow-sm focus:ring-purple-500 focus:border-purple-500`}
                onChange={handleChange}
                required
              />
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                id="password"
                value={formData.password}
                className={`w-full px-4 py-3 rounded-lg border ${showError ? 'border-red-500' : 'border-gray-300'} shadow-sm focus:ring-purple-500 focus:border-purple-500`}
                onChange={handleChange}
                required
              />
            </div>

            {/* Forgot Password Link */}
            <div className="text-center">
              <a className="text-sm text-purple-500 hover:underline cursor-pointer" onClick={openForgotPasswordModal}>
                Forgot your password?
              </a>
            </div>
            <ForgotPasswordModal isOpen={isForgotPasswordModalOpen} onClose={closeForgotPasswordModal} />

            {/* Error Message */}
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

            {/* Login Button */}
            <div>
              <button
                disabled={loading}
                type="submit"
                className={`w-full py-3 bg-purple-500 text-white font-semibold rounded-lg shadow-md hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-400 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {loading ? <CircularProgress /> : 'Login'}
              </button>
            </div>

            {/* Google Login Section */}
            <div className="text-center mt-4">
              <hr className="my-4 border-gray-300" />
              <span className="text-sm text-gray-500">or</span>
              <hr className="my-4 border-gray-300" />
              <GoogleLogin
                onSuccess={handleGoogleLogin}
                onError={() => console.log('Google Login Failed')}
              />
            </div>

            {/* Sign Up Link */}
            <div className="text-sm text-center mt-4">
              Don’t have an account yet?{' '}
              <Link to="/signup">
                <span className="text-purple-500 hover:underline">Sign up for free!</span>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
