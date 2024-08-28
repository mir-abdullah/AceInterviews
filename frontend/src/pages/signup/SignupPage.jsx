import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { signupUser } from '../../redux/slices/auth/auth.slice';
import OAuth from '../../components/OAuth';

export default function SignupPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState(null); // Define the error state

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setError(null); // Clear previous errors before submission
    const result = await dispatch(signupUser(formData));

    if (signupUser.fulfilled.match(result)) {
      navigate('/login');
    } else if (signupUser.rejected.match(result)) {
      // Check if the error is specifically due to the email being registered
      console.log(result)
      console.log()
      if (result.payload && result.payload.msg ) {
        setError("This email is already registered. Please use another email.");
      } else {
        setError("An error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out">
        <form onSubmit={submitHandler} className="space-y-6">
          <h2 className="text-center text-2xl font-extrabold text-gray-900">
            Sign Up
          </h2>
          {error && <p className="text-red-500 text-sm">{error}</p>} {/* Display error message */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
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
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              required
              placeholder="Enter your email"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              onChange={handleChange}
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              required
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
          <OAuth />
        </div>
        <div className="text-sm text-center">
          <Link to="/login">
            <p className="font-medium text-green-600 hover:text-green-500">
              Already have an account? Login
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
