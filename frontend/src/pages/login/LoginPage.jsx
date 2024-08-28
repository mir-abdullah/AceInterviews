import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../redux/slices/auth/auth.slice';
import { useNavigate, Link } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showError, setShowError] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowError(false);  
    setError(null);  // Clear previous error

    try {
      const result = await dispatch(loginUser(formData));
      if (loginUser.fulfilled.match(result)) {
        navigate('/dashboard/overview');
      } else if (loginUser.rejected.match(result)) {
        setError("Invalid Email or Password Entered");
        setShowError(true);
        setFormData((prev) => ({ ...prev, password: '' })); // Clear password field
        setTimeout(() => setShowError(false), 3000); // Reset border after 3 seconds
      }
    } catch (error) {
      setError("An unexpected error occurred");
      setShowError(true);
    }
  };

  return (
    <div className="flex justify-center gap-2 pt-10">
      <div className="max-w-md relative flex flex-col p-4 rounded-md text-black bg-white">
        <div className="text-2xl font-bold mb-2 text-[#1e0e4b] text-center">
          Welcome back to <span className="text-gradient">AceInterview</span>
        </div>
        <div className="text-sm font-normal mb-4 text-center text-[#1e0e4b]">
          Log in to your account
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="block relative">
            <label className="block text-gray-600 cursor-text text-sm leading-[140%] font-normal mb-2">
              Email
            </label>
            <input
              type="text"
              id="email"
              value={formData.email}
              className={`rounded border ${
                showError ? 'border-red-500' : 'border-gray-200'
              } text-sm w-full font-normal leading-[18px] text-black tracking-[0px] appearance-none block h-11 m-0 p-[11px] focus:ring-2 ring-offset-2 ring-gray-900 outline-0`}
              onChange={handleChange}
            />
          </div>
          <div className="block relative">
            <label className="block text-gray-600 cursor-text text-sm leading-[140%] font-normal mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={formData.password}
              className={`rounded border ${
                showError ? 'border-red-500' : 'border-gray-200'
              } text-sm w-full font-normal leading-[18px] text-black tracking-[0px] appearance-none block h-11 m-0 p-[11px] focus:ring-2 ring-offset-2 ring-gray-900 outline-0`}
              onChange={handleChange}
            />
          </div>
          <div>
            <a className="text-sm text-[#7747ff]" href="#">
              Forgot your password?
            </a>
          </div>
          <button
            disabled={loading}
            type="submit"
            className="flex items-center justify-center py-2 px-4 md:px-20 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-blue-600 hover:to-red-600 focus:ring-2 focus:ring-offset-2 focus:ring-blue-300 focus:ring-offset-gray-900 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none rounded-lg"
          >
            {loading ? <CircularProgress /> : 'Login'}
          </button>
        </form>
        <div className="text-sm text-center mt-[1.6rem]">
          Don’t have an account yet?{' '}
          <Link to="/signup">
            <span className="text-sm text-[#7747ff]">Sign up for free!</span>
          </Link>
        </div>
        {error && <p className="text-red-500 mt-5">{error}</p>}
      </div>
    </div>
  );
}
