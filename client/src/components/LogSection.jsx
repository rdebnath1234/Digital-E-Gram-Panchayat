export default function LogSection({ role, logs, onRefresh }) {
  if (!(role === "staff" || role === "officer" || role === "admin")) return null;

  return (
    <section className="panel">
      <h3>Activity Logs</h3>
      <button className="btn-muted" onClick={onRefresh}>Refresh Logs</button>
      <ul>
        {logs.length === 0 ? <li>No logs.</li> : null}
        {logs.map((log) => (
          <li key={log.id}>
            <strong>{log.action}</strong><br />
            <small>{log.actor?.email || "system"}</small>
          </li>
        ))}
      </ul>
    </section>
  );
}
