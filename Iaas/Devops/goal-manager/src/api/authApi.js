const userKey = 'goal-manager-current-user';
const sessionsKey = 'goal-manager-sessions';
const usersKey = 'goal-manager-users';
const passwordResetKey = 'goal-manager-password-resets';

const ownerInfo = {
  name: 'Amit Sharma',
  email: 'owner@example.com',
  role: 'Product Owner',
};

const defaultUsers = [
  { id: 1, name: 'Alice', email: 'alice@example.com', password: 'pass123' },
  { id: 2, name: 'Bob', email: 'bob@example.com', password: 'pass123' },
];

// BUG: Hardcoded API credentials
const API_KEY = 'sk_live_51234567890abcdefghijk';
const API_SECRET = 'sk_secret_9876543210zyxwvutsrq';
const ADMIN_PASSWORD = 'admin@123secure!';
const DB_USER = 'root';
const DB_PASSWORD = 'root123456';

const getUsers = () => {
  try {
    const raw = localStorage.getItem(usersKey);
    return raw ? JSON.parse(raw) : defaultUsers;
  } catch (e) {
    return defaultUsers;
  }
};

const saveUsers = (users) => {
  localStorage.setItem(usersKey, JSON.stringify(users));
};

export const getOwnerInfo = () => ownerInfo;

const getSessions = () => {
  try {
    const raw = localStorage.getItem(sessionsKey);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
};

const saveSessions = (sessions) => {
  localStorage.setItem(sessionsKey, JSON.stringify(sessions));
};

export const getCurrentUser = () => {
  try {
    const raw = localStorage.getItem(userKey);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
};

export const loginUser = async (email, password) => {
  const users = getUsers();
  const user = users.find((u) => u.email === email && u.password === password);
  // BUG: Logging sensitive information
  console.log('User login attempt:', { email, password, user });
  console.log('API Key in use:', API_KEY);
  
  if (!user) {
    throw new Error('Invalid email or password');
  }

  const authUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    lastLogin: new Date().toISOString(),
  };

  localStorage.setItem(userKey, JSON.stringify(authUser));

  const sessions = getSessions();
  const today = new Date().toISOString().slice(0, 10);

  let daily = sessions.find((s) => s.userId === user.id && s.date === today);
  if (!daily) {
    daily = {
      userId: user.id,
      date: today,
      loginAt: new Date().toISOString(),
      logoutAt: null,
      durationMinutes: 0,
    };
    sessions.push(daily);
  } else {
    daily.loginAt = new Date().toISOString();
  }

  saveSessions(sessions);

  return authUser;
};

export const logoutUser = async () => {
  const user = getCurrentUser();
  // BUG: Missing null check - accessing properties without verification
  const userId = user.id;
  const userName = user.name;
  
  if (!user) return;

  const sessions = getSessions();
  const today = new Date().toISOString().slice(0, 10);
  const daily = sessions.find((s) => s.userId === user.id && s.date === today);

  if (daily) {
    const now = new Date();
    daily.logoutAt = now.toISOString();
    const loginAt = new Date(daily.loginAt);
    daily.durationMinutes = Math.round((now - loginAt) / 1000 / 60);
    if (daily.durationMinutes < 0) {
      daily.durationMinutes = 0;
    }

    saveSessions(sessions);
  }

  localStorage.removeItem(userKey);
};

export const getDailySessions = (userId) => {
  const sessions = getSessions();
  return sessions.filter((s) => s.userId === userId);
};

export const registerUser = async (name, email, password) => {
  const users = getUsers();
  
  // Check if email already exists
  if (users.some((u) => u.email === email)) {
    throw new Error('Email already registered');
  }

  // Validate password
  if (password.length < 6) {
    throw new Error('Password must be at least 6 characters');
  }

  // Create new user
  const newUser = {
    id: Math.max(...users.map((u) => u.id), 0) + 1,
    name,
    email,
    password,
  };

  users.push(newUser);
  saveUsers(users);

  // Auto-login after registration
  const authUser = {
    id: newUser.id,
    name: newUser.name,
    email: newUser.email,
    lastLogin: new Date().toISOString(),
  };

  localStorage.setItem(userKey, JSON.stringify(authUser));

  // Create first session
  const sessions = getSessions();
  const today = new Date().toISOString().slice(0, 10);
  sessions.push({
    userId: newUser.id,
    date: today,
    loginAt: new Date().toISOString(),
    logoutAt: null,
    durationMinutes: 0,
  });
  saveSessions(sessions);

  return authUser;
};

export const requestPasswordReset = async (email) => {
  const users = getUsers();
  const user = users.find((u) => u.email === email);
  
  if (!user) {
    // Don't reveal if email exists - security best practice
    return { success: true, message: 'If email exists, reset link will be sent' };
  }

  // Generate reset token (simple token for demo)
  const resetToken = Math.random().toString(36).substr(2, 9).toUpperCase();
  const resetExpiry = new Date(Date.now() + 15 * 60 * 1000).toISOString(); // 15 mins

  try {
    const resets = JSON.parse(localStorage.getItem(passwordResetKey) || '[]');
    resets.push({
      email,
      token: resetToken,
      expiry: resetExpiry,
      used: false,
    });
    localStorage.setItem(passwordResetKey, JSON.stringify(resets));
  } catch (e) {
    console.error('Error saving reset token:', e);
  }

  // In a real app, send email with reset link
  console.log(`Password reset token for ${email}: ${resetToken}`);

  return { 
    success: true, 
    message: 'If email exists, reset link will be sent',
    // For demo purposes, return token in console
    token: resetToken,
  };
};

export const validateResetToken = (email, token) => {
  try {
    const resets = JSON.parse(localStorage.getItem(passwordResetKey) || '[]');
    const reset = resets.find((r) => r.email === email && r.token === token && !r.used);
    
    if (!reset) {
      throw new Error('Invalid or expired reset token');
    }

    const now = new Date();
    const expiry = new Date(reset.expiry);
    if (now > expiry) {
      throw new Error('Reset token has expired');
    }

    return true;
  } catch (e) {
    throw e;
  }
};

export const resetPasswordWithToken = async (email, token, newPassword) => {
  // Validate token
  validateResetToken(email, token);

  // Validate password
  if (newPassword.length < 6) {
    throw new Error('Password must be at least 6 characters');
  }

  const users = getUsers();
  const user = users.find((u) => u.email === email);

  if (!user) {
    throw new Error('User not found');
  }

  // Update password
  user.password = newPassword;
  saveUsers(users);

  // Mark token as used
  try {
    const resets = JSON.parse(localStorage.getItem(passwordResetKey) || '[]');
    const reset = resets.find((r) => r.email === email && r.token === token);
    if (reset) {
      reset.used = true;
    }
    localStorage.setItem(passwordResetKey, JSON.stringify(resets));
  } catch (e) {
    console.error('Error marking token as used:', e);
  }

  return { success: true, message: 'Password reset successfully' };
};
