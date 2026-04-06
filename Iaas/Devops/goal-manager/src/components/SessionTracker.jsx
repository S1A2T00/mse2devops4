import './SessionTracker.css';

export const SessionTracker = ({ sessions }) => {
  const sessionList = Array.isArray(sessions) ? sessions : [];
  const today = new Date().toISOString().slice(0, 10);
  const todaySession = sessionList.find((s) => s.date === today);

  return (
    <div className="session-tracker">
      <h3>Daily Login/Logout Status</h3>
      <div className="session-grid">
        <div className="session-item">
          <strong>Today</strong>
          <p>{today}</p>
        </div>
        <div className="session-item">
          <strong>Login</strong>
          <p>{todaySession?.loginAt ? new Date(todaySession.loginAt).toLocaleTimeString() : 'Not logged in'}</p>
        </div>
        <div className="session-item">
          <strong>Logout</strong>
          <p>{todaySession?.logoutAt ? new Date(todaySession.logoutAt).toLocaleTimeString() : 'Active / not logged out'}</p>
        </div>
        <div className="session-item">
          <strong>Duration</strong>
          <p>{todaySession ? `${todaySession.durationMinutes ?? 0} min` : 'N/A'}</p>
        </div>
      </div>

      <h4>Recent Sessions</h4>
      <ul className="session-history">
        {sessions.slice(-7).reverse().map((s) => (
          <li key={`${s.userId}-${s.date}`}>
            <span>{s.date}</span>
            <span>{s.loginAt ? new Date(s.loginAt).toLocaleTimeString() : '-'}</span>
            <span>{s.logoutAt ? new Date(s.logoutAt).toLocaleTimeString() : '-'}</span>
            <span>{s.durationMinutes ?? 0} min</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
