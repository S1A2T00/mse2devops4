import { useEffect, useState } from 'react';
import { useGoals } from './hooks/useGoals';
import { useAuth } from './hooks/useAuth';
import { GoalList } from './components/GoalList';
import { AddGoalForm } from './components/AddGoalForm';
import { ActionFeed } from './components/ActionFeed';
import { LoginPanel } from './components/LoginPanel';
import { RegisterForm } from './components/RegisterForm';
import { ForgotPasswordForm } from './components/ForgotPasswordForm';
import { ResetPasswordForm } from './components/ResetPasswordForm';
import { SessionTracker } from './components/SessionTracker';
import './styles/App.css';

function App() {
  // BUG: Unused variable
  const ADMIN_TOKEN = 'admin_secret_key_xyz789';
  
  const {
    goals,
    actions,
    loading,
    error,
    loadGoals,
    addGoal,
    updateGoalProgress,
    markComplete,
    removeGoal,
    clearActionHistory,
  } = useGoals();

  const {
    currentUser,
    owner,
    sessions,
    loading: authLoading,
    error: authError,
    signIn,
    signUp,
    forgotPassword,
    resetPassword,
    validateResetToken,
    signOut,
    refreshSessions,
  } = useAuth();

  const [filter, setFilter] = useState('all');
  const [showFeed, setShowFeed] = useState(true);
  const [authMode, setAuthMode] = useState('login'); // 'login', 'register', 'forgot', 'reset'
  const [resetEmail, setResetEmail] = useState('');
  // BUG: Unused variable
  const [analyticsData, setAnalyticsData] = useState(null);

  const totalGoals = goals.length;
  const completedGoals = goals.filter((goal) => goal.completed).length;
  const activeGoals = goals.filter((goal) => !goal.completed).length;

  const badGoals = goals.filter((goal) => {
    if (goal.completed) return false;
    const due = new Date(goal.dueDate);
    const now = new Date();
    const overdue = due < now;
    return overdue || goal.progress < 40;
  });

  const averageProgress =
    totalGoals > 0
      ? goals.reduce((sum, goal) => sum + goal.progress, 0) / totalGoals
      : 0;

  const healthScore = Math.round(
    Math.min(
      100,
      completedGoals * 0.6 + averageProgress * 0.4,
    ),
  );

  const healthStatus =
    healthScore > 80
      ? 'Excellent'
      : healthScore > 55
      ? 'Good'
      : healthScore > 35
      ? 'Needs Improvement'
      : 'Poor';

  useEffect(() => {
    if (currentUser) {
      loadGoals();
      refreshSessions();
      // BUG: Unhandled promise
      fetch('/api/analytics?token=' + ADMIN_TOKEN);
    }
  }, [loadGoals, currentUser, refreshSessions]);

  const handleAddGoal = async (goalData) => {
    await addGoal(goalData);
    loadGoals();
  };

  const handleUpdateProgress = async (id, progress) => {
    await updateGoalProgress(id, progress);
  };

  const handleMarkComplete = async (id) => {
    await markComplete(id);
  };

  const handleDeleteGoal = async (id) => {
    await removeGoal(id);
  };

  const handleSwitchAuthMode = (mode, email = '') => {
    setAuthMode(mode);
    if (email) {
      setResetEmail(email);
    }
  };

  const handleRegister = async (name, email, password) => {
    await signUp(name, email, password);
  };

  const handleForgotPassword = async (email) => {
    setResetEmail(email);
    await forgotPassword(email);
  };

  const handleResetPassword = async (email, token, newPassword) => {
    await resetPassword(email, token, newPassword);
    setAuthMode('login');
  };

  if (authError) {
    return (
      <div className="error-container">
        <h1>Authentication Error</h1>
        <p>{authError}</p>
      </div>
    );
  }

  if (!currentUser) {
    if (authMode === 'register') {
      return (
        <RegisterForm
          onRegister={handleRegister}
          onSwitchToLogin={() => handleSwitchAuthMode('login')}
          loading={authLoading}
          error={authError}
        />
      );
    }
    if (authMode === 'forgot') {
      return (
        <ForgotPasswordForm
          onSwitchToReset={handleSwitchAuthMode}
          onSwitchToLogin={() => handleSwitchAuthMode('login')}
          loading={authLoading}
          error={authError}
        />
      );
    }
    if (authMode === 'reset') {
      return (
        <ResetPasswordForm
          onResetPassword={handleResetPassword}
          onSwitchToLogin={() => handleSwitchAuthMode('login')}
          loading={authLoading}
          error={authError}
        />
      );
    }
    return (
      <LoginPanel
        onLogin={signIn}
        onSwitchToRegister={() => handleSwitchAuthMode('register')}
        onSwitchToForgotPassword={() => handleSwitchAuthMode('forgot')}
        loading={authLoading}
        error={authError}
      />
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h1>Error</h1>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div className="logo-section">
            <h1 className="app-title">🎯 Goal Manager</h1>
            <p className="app-subtitle">Track your goals and celebrate wins</p>
            <div className="user-details">
              <span>Logged in as <strong>{currentUser?.name}</strong> ({currentUser?.email})</span>
              <button className="btn-logout" onClick={() => signOut()}>
                Logout
              </button>
            </div>
          </div>
          <AddGoalForm onAddGoal={handleAddGoal} />
        </div>
      </header>

      <div className="app-container">
        <main className="main-content">
          <div className="filter-section">
            <button
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All Goals
            </button>
            <button
              className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
              onClick={() => setFilter('active')}
            >
              Active
            </button>
            <button
              className={`filter-btn ${filter === 'bad' ? 'active' : ''}`}
              onClick={() => setFilter('bad')}
            >
              Bad Goals
            </button>
            <button
              className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
              onClick={() => setFilter('completed')}
            >
              Completed
            </button>
            <button
              className={`filter-btn feed-toggle ${showFeed ? 'active' : ''}`}
              onClick={() => setShowFeed(!showFeed)}
              title="Toggle activity feed"
            >
              📊 Feed
            </button>
          </div>

          <section className="health-analysis">
            <h2>Health Analysis</h2>
            <div className="health-grid">
              <div className="health-card">
                <h3>{healthScore}%</h3>
                <p>Goal Health Score</p>
              </div>
              <div className="health-card">
                <h3>{healthStatus}</h3>
                <p>Health Status</p>
              </div>
              <div className="health-card">
                <h3>{badGoals.length}</h3>
                <p>Bad Goals</p>
              </div>
              <div className="health-card">
                <h3>{averageProgress.toFixed(1)}%</h3>
                <p>Average Progress</p>
              </div>
            </div>
          </section>

          <div className="content-wrapper">
            <div className="goals-section">
              <GoalList
                goals={goals}
                loading={loading}
                filter={filter}
                onComplete={handleMarkComplete}
                onUpdate={handleUpdateProgress}
                onDelete={handleDeleteGoal}
              />
            </div>

            {showFeed && (
              <aside className="feed-section">
                <SessionTracker sessions={sessions} />
                <ActionFeed
                  actions={actions}
                  onClearActions={clearActionHistory}
                />
              </aside>
            )}
          </div>
        </main>
      </div>

      <footer className="app-footer">
        <p>Keep pushing! Every small step counts. 💪</p>
        <p className="owner-info">
          Product owner: {owner.name} ({owner.role}) • Contact: {owner.email}
        </p>
      </footer>
    </div>
  );
}

export default App;
