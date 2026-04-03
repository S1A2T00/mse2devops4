import { useState } from 'react';
import './LoginPanel.css';

export const ResetPasswordForm = ({ onResetPassword, onSwitchToLogin, loading, error }) => {
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validationError, setValidationError] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');

    // Validation
    if (!email.trim()) {
      setValidationError('Email is required');
      return;
    }
    if (!token.trim()) {
      setValidationError('Reset token is required');
      return;
    }
    if (newPassword.length < 6) {
      setValidationError('Password must be at least 6 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      setValidationError('Passwords do not match');
      return;
    }

    try {
      await onResetPassword(email.trim(), token.trim(), newPassword);
      setResetSuccess(true);
    } catch (err) {
      setValidationError(err.message);
    }
  };

  const displayError = validationError || error;

  if (resetSuccess) {
    return (
      <div className="login-panel">
        <div className="login-box">
          <h2>Password Reset Successful</h2>
          <p>Your password has been reset successfully.</p>
          
          <div className="reset-message">
            <p>You can now sign in with your new password.</p>
          </div>

          <button 
            type="button" 
            className="primary-button"
            onClick={onSwitchToLogin}
          >
            Go to Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="login-panel">
      <div className="login-box">
        <h2>Enter Reset Details</h2>
        <p>Enter the token from your email and your new password.</p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="reset-check-email">Email Address</label>
          <input
            id="reset-check-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />

          <label htmlFor="reset-token">Reset Token</label>
          <input
            id="reset-token"
            type="text"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Enter the token from your email"
            required
          />

          <label htmlFor="new-password">New Password</label>
          <input
            id="new-password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="At least 6 characters"
            required
          />

          <label htmlFor="confirm-new-password">Confirm Password</label>
          <input
            id="confirm-new-password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm your password"
            required
          />

          {displayError && <div className="login-error">{displayError}</div>}

          <button type="submit" disabled={loading}>
            {loading ? 'Resetting…' : 'Reset Password'}
          </button>
        </form>

        <div className="login-links">
          <p>
            <button 
              type="button" 
              className="link-button" 
              onClick={onSwitchToLogin}
            >
              Back to Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
