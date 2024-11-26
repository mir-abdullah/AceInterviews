import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sendOtp, verifyOtp, forgotPassword } from '../../redux/slices/user/user.slice';
import Modal from 'react-modal';
import CircularProgress from '@mui/material/CircularProgress';
import { toast } from 'react-toastify';

const ForgotPasswordModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(new Array(6).fill(''));
  const [newPassword, setNewPassword] = useState('');
  const [timer, setTimer] = useState(60);
  const [showResendOtp, setShowResendOtp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const dispatch = useDispatch();
  const { otpSent, otpVerified, resetPasswordStatus, error } = useSelector((state) => state.auth);

  useEffect(() => {
    if (otpSent) {
      setStep(2);
      startTimer();
    }
  }, [otpSent]);

  useEffect(() => {
    if (otpVerified) {
      setStep(3);
      setTimer(0);
    }
  }, [otpVerified]);

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    } else {
      setShowResendOtp(true);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const startTimer = () => {
    setTimer(60);
    setShowResendOtp(false);
  };

  const handleSendOtp = async () => {
    setLoading(true);
    try {
      await dispatch(sendOtp(email));
      setStep(2);
    } catch (error) {
      console.error('Error sending OTP:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setLoading(true);
    try {
      const otpString = otp.join('');
      const result = await dispatch(verifyOtp({ email, otp: otpString }));

      if (verifyOtp.fulfilled.match(result)) {
        setStep(3);
      } else {
        // Set error message for invalid OTP
        toast.error("Invalid OTP entered. Please try again."); 
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    setLoading(true);
    try {
      const result = await dispatch(forgotPassword({ email, newPassword }));
      if (forgotPassword.fulfilled.match(result)) {
        toast.success("Password Reset Successful");
        setSuccessMessage("Password has been reset successfully.");
        onClose();
      } else {
        // Set error message for failed password reset
        toast.error("Password Reset Failed. Please check your email and try again.");
      }
    } catch (error) {
      console.error('Error during password reset:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (element, index) => {
    if (isNaN(element.value)) return;

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    if (element.nextSibling) {
      element.nextSibling.focus();
    }
  };

  useEffect(() => {
    if (isOpen) {
      setSuccessMessage('');
    }
  }, [isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="modal-container p-8 bg-white rounded-lg shadow-lg max-w-md w-full mx-auto"
      overlayClassName="modal-overlay fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
    >
      <div className="modal-content">
        {successMessage && <p className="text-green-500 mb-4">{successMessage}</p>}

        {step === 1 && (
          <>
            <h2 className="text-xl font-bold text-blue-700 mb-2">Forgot Password</h2>
            <p className="text-sm text-gray-600 mb-4">Please enter your email address to receive an OTP.</p>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="input-field border rounded p-3 w-full mb-4"
            />
            <button
              onClick={handleSendOtp}
              className={`action-button bg-blue-600 text-white py-2 px-4 rounded w-full hover:bg-blue-700 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={loading}
            >
              {loading ? <CircularProgress size={20} /> : 'Send OTP'}
            </button>
            {error && <p className="text-red-500 mt-4">{error}</p>}
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="text-xl font-bold text-blue-700 mb-2">Verify OTP</h2>
            <p className="text-sm text-gray-600 mb-4">Enter the OTP sent to your email address.</p>
            <div className="flex justify-between">
              {otp.map((_, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength="1"
                  value={otp[index]}
                  onChange={(e) => handleOtpChange(e.target, index)}
                  className="otp-input-box border border-gray-300 p-2 text-center text-lg w-12 h-12 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              ))}
            </div>
            <button
              onClick={handleVerifyOtp}
              className={`action-button bg-green-600 text-white py-2 px-4 rounded w-full hover:bg-green-700 mt-4 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={loading}
            >
              {loading ? <CircularProgress size={20} /> : 'Verify OTP'}
            </button>
            {timer > 0 ? (
              <p className="text-gray-500 mt-2">Time left: {timer} seconds</p>
            ) : (
              showResendOtp && (
                <button className="text-blue-600 mt-2" onClick={handleSendOtp}>
                  Resend OTP
                </button>
              )
            )}
            {error && <p className="text-red-500 mt-4">{error}</p>}
          </>
        )}

        {step === 3 && (
          <>
            <h2 className="text-xl font-bold text-blue-700 mb-2">Reset Password</h2>
            <p className="text-sm text-gray-600 mb-4">Enter your new password below.</p>
            <input
              type="password"
              minLength={8}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New Password"
              className="input-field border rounded p-3 w-full mb-4"
            />
            <button
              onClick={handleResetPassword}
              className={`action-button bg-purple-600 text-white py-2 px-4 rounded w-full hover:bg-purple-700 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={loading}
            >
              {loading ? <CircularProgress size={20} /> : 'Reset Password'}
            </button>
            {error && <p className="text-red-500 mt-4">{error}</p>}
          </>
        )}
        {successMessage && <p className="text-green-600 mt-4">{successMessage}</p>}
      </div>
    </Modal>
  );
};

export default ForgotPasswordModal;
