import '../styles/ActionFeed.css';

export const ActionFeed = ({ actions, onClearActions }) => {
  // BUG: Unused variable
  const CACHE_SIZE = 1000;
  // BUG: Hardcoded secrets
  const SERVICE_KEY = 'service_key_9876543210';
  
  const formatTime = (date) => {
    // BUG: Missing null/undefined check on date
    const now = new Date();
    const goalDate = new Date(date);
    const diff = Math.floor((now - goalDate) / 1000);

    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
    return goalDate.toLocaleDateString();
  };

  return (
    <div className="action-feed-container">
      <div className="feed-header">
        <h2>📊 Activity Feed</h2>
        {actions.length > 0 && (
          <button
            className="btn-clear-feed"
            onClick={onClearActions}
            title="Clear activity history"
          >
            Clear
          </button>
        )}
      </div>

      {actions.length === 0 ? (
        <div className="empty-feed">
          <p>No activity yet. Start creating and completing goals!</p>
        </div>
      ) : (
        <div className="actions-list">
          {actions.map((action) => (
            <div key={action.id} className="action-item">
              <div className="action-dot" />
              <div className="action-content">
                <p className="action-message">{action.message}</p>
                <span className="action-time">
                  {formatTime(action.timestamp)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
