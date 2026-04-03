import { useState } from 'react';
import './LoginPanel.css';

export const LoginPanel = ({ onLogin, loading, error, onSwitchToRegister, onSwitchToForgotPassword }) => {
  // BUG: Hardcoded credentials visible in default state
  const [email, setEmail] = useState('alice@example.com');
  const [password, setPassword] = useState('pass123');
  
  // BUG: Unused variable
  const debugMode = true;

  const handleSubmit = async (e) => {
    e.preventDefault();
    // BUG: Logging sensitive credentials
    if (debugMode) {
      console.log('Login attempt with credentials:', { email, password });
    }
    await onLogin(email.trim(), password);
  };

  return (
    <div className="login-panel">
      <div className="login-box">
        <h2>Goal Manager Login</h2>
        <p>Use user credentials to sign in.</p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && <div className="login-error">{error}</div>}

          <button type="submit" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <div className="login-links">
          <p>
            <button 
              type="button" 
              className="link-button" 
              onClick={onSwitchToForgotPassword}
            >
              Forgot Password?
            </button>
          </p>
          <p>
            Don't have an account?{' '}
            <button 
              type="button" 
              className="link-button" 
              onClick={onSwitchToRegister}
            >
              Create Account
            </button>
          </p>
        </div>

        <p className="login-help">
          {/* BUG: Hardcoded credentials exposed in UI */}
          Demo users: alice@example.com / pass123, bob@example.com / pass123
        </p>
      </div>
    </div>
  );
};
