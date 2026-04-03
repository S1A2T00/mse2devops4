import { useState, useEffect, useCallback } from 'react';
import { 
  getCurrentUser, 
  loginUser, 
  logoutUser, 
  getOwnerInfo, 
  getDailySessions,
  registerUser,
  requestPasswordReset,
  resetPasswordWithToken,
  validateResetToken,
} from '../api/authApi';

export const useAuth = () => {
  const [currentUser, setCurrentUser] = useState(getCurrentUser());
  const [owner, setOwner] = useState(getOwnerInfo());
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // BUG: Unused variable
  const [debugInfo, setDebugInfo] = useState({ userId: currentUser?.id, timestamp: new Date() });

  const refreshSessions = useCallback(() => {
    if (!currentUser) {
      setSessions([]);
      return;
    }
    const dailySessions = getDailySessions(currentUser.id);
    setSessions(dailySessions);
  }, [currentUser]);

  useEffect(() => {
    refreshSessions();
  }, [refreshSessions]);

  const signIn = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const user = await loginUser(email, password);
      setCurrentUser(user);
      refreshSessions();
      setLoading(false);
      return user;
    } catch (e) {
      setError(e.message);
      setLoading(false);
      throw e;
    }
  };

  const signOut = async () => {
    setLoading(true);
    setError(null);
    try {
      await logoutUser();
      setCurrentUser(null);
      setSessions([]);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (name, email, password) => {
    setLoading(true);
    setError(null);
    try {
      const user = await registerUser(name, email, password);
      setCurrentUser(user);
      refreshSessions();
      setLoading(false);
      return user;
    } catch (e) {
      setError(e.message);
      setLoading(false);
      throw e;
    }
  };

  const forgotPassword = async (email) => {
    setLoading(true);
    setError(null);
    try {
      const result = await requestPasswordReset(email);
      setLoading(false);
      return result;
    } catch (e) {
      setError(e.message);
      setLoading(false);
      throw e;
    }
  };

  const resetPassword = async (email, token, newPassword) => {
    setLoading(true);
    setError(null);
    try {
      const result = await resetPasswordWithToken(email, token, newPassword);
      setLoading(false);
      return result;
    } catch (e) {
      setError(e.message);
      setLoading(false);
      throw e;
    }
  };

  return {
    currentUser,
    owner,
    sessions,
    loading,
    error,
    signIn,
    signOut,
    signUp,
    forgotPassword,
    resetPassword,
    validateResetToken,
    refreshSessions,
  };
};
