import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { signupUser, googleLogin } from '../../redux/slices/auth/auth.slice';
import { GoogleLogin } from '@react-oauth/google';
import Modal from 'react-modal';

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

  // Set the app element for accessibility
  Modal.setAppElement('#root');

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
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out">
        <form onSubmit={submitHandler} className="space-y-6">
          <h2 className="text-center text-2xl font-extrabold text-gray-900">
            Sign Up
          </h2>
          {error && <p className="text-red-500 text-sm">{error}</p>}
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
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700" >
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
  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
  onChange={handleChange}
/>

          </div>
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
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              onChange={handleChange}
            />
          </div>
          <div>
            <button
              disabled={loading}
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              {loading ? "Loading..." : "Sign Up"}
            </button>
          </div>
        </form>
        <div className="py-5">
          <GoogleLogin
            onSuccess={handleGoogleSignUp}
            onError={() => console.log('Google Sign-Up Failed')}
          />
        </div>
        <div className="text-sm text-center">
          <Link to="/login">
            <p className="font-medium text-green-600 hover:text-green-500">
              Already have an account? Login
            </p>
          </Link>
        </div>

        {/* Modal */}
        <Modal
  isOpen={isModalOpen}
  onRequestClose={closeModal}
  contentLabel="Account Created"
  className="fixed inset-0 flex items-center justify-center p-4 bg-gray-900 bg-opacity-50 transition-opacity duration-300"
>
  <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-auto">
    <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
      Account Created Successfully
    </h2>
    <p className="text-gray-600 mb-6 text-center">
      An email has been sent to your email address. Please verify it to log in.
    </p>
    <button
      onClick={closeModal}
      className="w-full py-3 px-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 shadow-md transform transition-transform duration-200 hover:scale-105"
    >
      Close
    </button>
  </div>
</Modal>

      </div>
    </div>
  );
}
