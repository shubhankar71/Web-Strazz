import { Link } from "react-router-dom";
import { ChevronRight, AlertTriangle } from "lucide-react";
import StatusBadge from "../ui/StatusBadge";
import { formatSessionTime, formatDuration } from "../../utils/sessionMetrics";
import "./SessionTable.css";

export default function SessionTable({ sessions = [], compact = false }) {
  if (!sessions.length) {
    return (
      <div className="ws-session-table-empty">
        <AlertTriangle size={20} className="ws-session-table-empty__icon" />
        <span>No matching sessions found</span>
      </div>
    );
  }

  return (
    <div className="ws-session-table-wrapper" role="region" tabIndex={0} aria-label={compact ? "Recent sessions table" : "Sessions table"}>
      <table className={`ws-session-table${compact ? " ws-session-table--compact" : ""}`}>
        <thead>
          <tr>
            <th scope="col">Session ID</th>
            <th scope="col">Started</th>
            <th scope="col">Duration</th>
            <th scope="col">Events</th>
            <th scope="col">Errors</th>
            {!compact && <th scope="col">Browser</th>}
            {!compact && <th scope="col">Device</th>}
            <th scope="col">Last Page</th>
            <th scope="col">Status</th>
            <th scope="col" className="ws-text-right">Action</th>
          </tr>
        </thead>
        <tbody>
          {sessions.map((session) => (
            <tr key={session.sessionId}>
              <td className="ws-session-table__id-col">
                <Link to={`/sessions/${session.sessionId}`} className="ws-session-table__id-link">
                  {session.sessionId}
                </Link>
              </td>

              <td className="ws-session-table__time-col">
                <span title={new Date(session.startedAt).toLocaleString()}>
                  {formatSessionTime(session.startedAt)}
                </span>
              </td>

              <td className="ws-mono">{formatDuration(session.duration)}</td>

              <td className="ws-mono">{session.eventCount}</td>

              <td>
                {session.errorCount > 0 ? (
                  <span className="ws-error-tag">
                    {session.errorCount} {session.errorCount === 1 ? "error" : "errors"}
                  </span>
                ) : (
                  <span className="ws-error-none">0</span>
                )}
              </td>

              {!compact && (
                <td>
                  <span className="ws-session-table__subtext">
                    {session.browser} <span className="ws-text-tertiary">v{session.browserVersion}</span>
                  </span>
                </td>
              )}

              {!compact && (
                <td>
                  <span className="ws-session-table__subtext">
                    {session.device} ({session.operatingSystem})
                  </span>
                </td>
              )}

              <td className="ws-session-table__page-col">
                <code className="ws-page-path" title={session.lastPage}>
                  {session.lastPage}
                </code>
              </td>

              <td>
                <StatusBadge status={session.status} />
              </td>

              <td className="ws-text-right">
                <Link
                  to={`/sessions/${session.sessionId}`}
                  className="ws-action-link"
                  aria-label={`Inspect session ${session.sessionId}`}
                >
                  <span>Inspect</span>
                  <ChevronRight size={14} />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
