import React, { useState } from 'react';
import Modal from 'react-modal'; // Make sure to install react-modal
import { useDispatch } from 'react-redux';
import { sendOtp, verifyOtp, changePassword } from '../../redux/slices/user/user.slice'; // Adjust the import path accordingly

Modal.setAppElement('#root'); // Set your app root for accessibility

const ForgotPasswordModal = ({ isOpen, onRequestClose }) => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState(1);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  const handleSendOtp = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await dispatch(sendOtp(email));
      if (sendOtp.fulfilled.match(result)) {
        setOtpSent(true);
        setStep(2); // Move to OTP verification step
      } else {
        setError(result.payload || 'Failed to send OTP');
      }
    } catch (error) {
      setError('An error occurred while sending OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await dispatch(verifyOtp({ email, otp }));
      if (verifyOtp.fulfilled.match(result)) {
        setStep(3); // Move to password reset step
      } else {
        setError(result.payload || 'Invalid OTP');
      }
    } catch (error) {
      setError('An error occurred while verifying OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await dispatch(changePassword(newPassword));
      if (changePassword.fulfilled.match(result)) {
        alert('Password changed successfully!'); // Success message
        onRequestClose(); // Close modal
      } else {
        setError(result.payload || 'Failed to change password');
      }
    } catch (error) {
      setError('An error occurred while changing password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} className="modal" overlayClassName="overlay">
      <h2 className="text-lg font-bold mb-4">Forgot Password</h2>
      {error && <p className="text-red-500">{error}</p>}
      {step === 1 && (
        <div>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input"
          />
          <button onClick={handleSendOtp} disabled={loading} className="button">
            {loading ? 'Sending...' : 'Send OTP'}
          </button>
        </div>
      )}
      {step === 2 && otpSent && (
        <div>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="input"
          />
          <button onClick={handleVerifyOtp} disabled={loading} className="button">
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>
        </div>
      )}
      {step === 3 && (
        <div>
          <input
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="input"
          />
          <button onClick={handleChangePassword} disabled={loading} className="button">
            {loading ? 'Changing...' : 'Change Password'}
          </button>
        </div>
      )}
      <button onClick={onRequestClose} className="button mt-4">Close</button>
    </Modal>
  );
};

export default ForgotPasswordModal;
