import { useState } from 'react';
import './LoginPanel.css';

export const ForgotPasswordForm = ({ onSwitchToReset, onSwitchToLogin, loading, error }) => {
  const [email, setEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      return;
    }
    
    try {
      await onSwitchToReset('request', email.trim());
      setResetSent(true);
      setEmail('');
    } catch (err) {
      // Error will be displayed via error prop
    }
  };

  if (resetSent) {
    return (
      <div className="login-panel">
        <div className="login-box">
          <h2>Check Your Email</h2>
          <p>We've sent password reset instructions to your email address.</p>
          
          <div className="reset-message">
            <p>If you don't see the email, check your spam folder.</p>
            <p>You'll receive a token to reset your password.</p>
          </div>

          <button 
            type="button" 
            className="primary-button"
            onClick={() => {
              setResetSent(false);
              onSwitchToReset('confirm');
            }}
          >
            Enter Reset Token
          </button>

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
  }

  return (
    <div className="login-panel">
      <div className="login-box">
        <h2>Reset Password</h2>
        <p>Enter your email address and we'll send you a password reset link.</p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="reset-email">Email Address</label>
          <input
            id="reset-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />

          {error && <div className="login-error">{error}</div>}

          <button type="submit" disabled={loading}>
            {loading ? 'Sending…' : 'Send Reset Link'}
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
