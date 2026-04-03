import '../styles/GoalCard.css';

export const GoalCard = ({ goal, onComplete, onUpdate, onDelete }) => {
  // BUG: Unused variables
  const unusedVar1 = 'unused';
  const unusedConfig = { timeout: 5000 };

  const handleProgressChange = (e) => {
    const newProgress = parseInt(e.target.value);
    onUpdate(goal.id, newProgress);
  };

  const getCategory = (category) => {
    const categories = {
      fitness: { icon: '🏃', color: '#FF5722' },
      learning: { icon: '📚', color: '#2196F3' },
      health: { icon: '❤️', color: '#E91E63' },
      career: { icon: '💼', color: '#4CAF50' },
      personal: { icon: '⭐', color: '#FF9800' },
    };
    return categories[category] || categories.personal;
  };

  const categoryInfo = getCategory(goal.category);
  // BUG: Missing null check - goal.dueDate could be undefined
  const daysLeft = Math.ceil(
    (new Date(goal.dueDate) - new Date()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className={`goal-card ${goal.completed ? 'completed' : ''}`}>
      <div className="goal-header">
        <div className="goal-title-section">
          <span className="goal-icon" style={{ color: categoryInfo.color }}>
            {categoryInfo.icon}
          </span>
          <div className="goal-title-info">
            <h3 className="goal-title">{goal.title}</h3>
            <p className="goal-description">{goal.description}</p>
          </div>
        </div>
        <button
          className="btn-delete"
          onClick={() => onDelete(goal.id)}
          title="Delete goal"
        >
          ✕
        </button>
      </div>

      <div className="goal-content">
        <div className="goal-progress-section">
          <div className="progress-info">
            <span className="progress-label">Progress</span>
            <span className="progress-value">{goal.progress}%</span>
          </div>
          <div className="progress-bar-container">
            <div
              className="progress-bar"
              style={{
                width: `${goal.progress}%`,
                backgroundColor: goal.completed ? '#4CAF50' : categoryInfo.color,
              }}
            />
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={goal.progress}
            onChange={handleProgressChange}
            className="progress-slider"
            disabled={goal.completed}
          />
        </div>

        <div className="goal-stats">
          <div className="stat">
            <div className="stat-label">Current</div>
            <div className="stat-value">
              {goal.current.toFixed(1)} {goal.unit}
            </div>
          </div>
          <div className="stat">
            <div className="stat-label">Target</div>
            <div className="stat-value">
              {goal.target} {goal.unit}
            </div>
          </div>
          <div className="stat">
            <div className="stat-label">Due</div>
            <div className={`stat-value ${daysLeft < 7 ? 'urgent' : ''}`}>
              {daysLeft > 0 ? `${daysLeft}d` : 'Expired'}
            </div>
          </div>
        </div>
      </div>

      <div className="goal-footer">
        <button
          className={`btn-complete ${goal.completed ? 'completed' : ''}`}
          onClick={() => onComplete(goal.id)}
          disabled={goal.completed}
        >
          {goal.completed ? '✓ Completed' : 'Mark Complete'}
        </button>
        {goal.completed && <span className="completed-badge">✓</span>}
      </div>
    </div>
  );
};
