import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginAdmin } from '../../redux/slices/admin/admin.slice'; 
import { useNavigate } from 'react-router-dom';
import adminPage from '../../assets/adminPage.jpg';
import logo from '../../assets/logo.png'

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const dispatch = useDispatch();
  const { loading, error, admin } = useSelector((state) => state.admin);
  const navigate = useNavigate(); 

  useEffect(() => {
    if (admin) {
      navigate('/admin/overview'); 
    }
  }, [admin, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginAdmin({ email, password }));
  };
//bg-gradient-to-r from-purple-300 via-blue-200 to-green-300
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white shadow-lg rounded-lg flex max-w-4xl mx-auto p-6">
        {/* Left Section */}
        <div className="hidden lg:flex w-1/2 items-center justify-center">
          <img src={adminPage} alt="Admin Login Illustration" className="w-full h-auto" />
        </div>

        {/* Right Section (Form) */}
        <div className="w-full lg:w-1/2 p-8">
          {/* Logo */}
          <div className="mb-4 text-center">
            <img src={logo} alt="Company Logo" className="h-8 mx-auto" />
          </div>
          {/* Title */}
          <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">Admin Login</h2>

          {/* Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <div className="mt-1 relative">
                <input
                  type="email"
                  placeholder="Enter Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-purple-500 focus:border-purple-500"
                  required
                />
                <span className="absolute inset-y-0 right-4 flex items-center">
                  <i className="fas fa-envelope text-gray-400"></i>
                </span>
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <div className="mt-1 relative">
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-purple-500 focus:border-purple-500"
                  required
                />
                <span className="absolute inset-y-0 right-4 flex items-center">
                  <i className="fas fa-lock text-gray-400"></i>
                </span>
              </div>
            </div>

            {/* Error Message */}
            {error && <p className="text-red-500 text-sm">{error}</p>}

            {/* Login Button */}
            <div>
              <button
                type="submit"
                className={`w-full py-3 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-purple-400 ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'LOGIN'}
              </button>
            </div>

            {/* Terms of Use */}
            <div className="text-center text-sm text-gray-400 mt-6">
              <p>Terms of use. Privacy policy</p>
            </div>
          </form>

          {/* Welcome Message */}
          {admin && <p className="text-green-500 text-center mt-4">Welcome, {admin}!</p>}
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
