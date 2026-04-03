import { GoalCard } from './GoalCard';
import '../styles/GoalList.css';

export const GoalList = ({
  goals,
  loading,
  onComplete,
  onUpdate,
  onDelete,
  filter,
}) => {
  // BUG: Unused variable
  const DEBUG_MODE = process.env.NODE_ENV === 'development';
  
  const getBadGoals = (goalList) => {
    // BUG: Missing null/undefined check on goalList
    const today = new Date();
    return goalList.filter((goal) => {
      const due = new Date(goal.dueDate);
      const isOverdue = !goal.completed && due < today;
      const lowProgress = !goal.completed && goal.progress < 40;
      return isOverdue || lowProgress;
    });
  };

  const badGoals = getBadGoals(goals);

  const filteredGoals = goals.filter((goal) => {
    if (filter === 'all') return true;
    if (filter === 'active') return !goal.completed;
    if (filter === 'completed') return goal.completed;
    if (filter === 'bad') return badGoals.some((g) => g.id === goal.id);
    return true;
  });

  const completedCount = goals.filter((g) => g.completed).length;
  const totalGoals = goals.length;
  const badCount = badGoals.length;

  if (loading) {
    return (
      <div className="goals-container">
        <div className="loading">Loading your goals...</div>
      </div>
    );
  }

  return (
    <div className="goals-container">
      <div className="goals-header">
        <div className="goals-stats">
          <div className="stat-box">
            <div className="stat-count">{completedCount}</div>
            <div className="stat-label">Completed</div>
          </div>
          <div className="stat-box">
            <div className="stat-count">{totalGoals - completedCount}</div>
            <div className="stat-label">Active</div>
          </div>
          <div className="stat-box">
            <div className="stat-count">{badCount}</div>
            <div className="stat-label">Bad Goals</div>
          </div>
          <div className="stat-box">
            <div className="stat-count">{totalGoals}</div>
            <div className="stat-label">Total</div>
          </div>
        </div>
      </div>

      {filteredGoals.length === 0 ? (
        <div className="empty-state">
          <p className="empty-icon">🎯</p>
          <p className="empty-text">
            {filter === 'completed'
              ? "No completed goals yet. Keep working!"
              : filter === 'active'
              ? "No active goals. Create one to get started!"
              : "No goals yet. Create your first goal!"}
          </p>
        </div>
      ) : (
        <div className="goals-list">
          {filteredGoals.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              onComplete={onComplete}
              onUpdate={onUpdate}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};
